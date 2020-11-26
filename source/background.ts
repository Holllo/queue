import {browser, Menus} from 'webextension-polyfill-ts';
import {
  error,
  getManifest,
  getNextQItem,
  getSettings,
  migrate,
  newQItemID,
  QItem,
  QMessage,
  removeQItem,
  saveSettings,
  updateBadge,
  versionAsNumber
} from '.';

let timeoutID: number | null = null;

browser.browserAction.onClicked.addListener(async () => {
  // When the extension icon is initially clicked, create a timeout for 500ms
  // that will open the next queue item when it expires.
  // If the icon is clicked again in those 500ms, open the options page instead.
  if (timeoutID === null) {
    timeoutID = window.setTimeout(async () => {
      timeoutID = null;
      const nextItem = await getNextQItem();

      if (nextItem === undefined) {
        await openOptionsPage();
      } else {
        const tabs = await browser.tabs.query({
          currentWindow: true,
          active: true
        });

        const message: QMessage<QItem> = {
          action: 'queue open url',
          data: nextItem
        };

        try {
          await browser.tabs.sendMessage(tabs[0].id!, message);
        } catch {
          await browser.tabs.create({active: true, url: nextItem.url});
        }

        await removeQItem(nextItem.id);
      }
    }, 500);
  } else {
    window.clearTimeout(timeoutID);
    timeoutID = null;
    await openOptionsPage();
  }
});

browser.runtime.onMessage.addListener(async (request: QMessage<unknown>) => {
  if (request.action === 'queue update badge') {
    await updateBadge();
  }
});

browser.runtime.onInstalled.addListener(async () => {
  const manifest = getManifest();
  const settings = await getSettings();
  const versionGotUpdated =
    versionAsNumber(manifest.version) > versionAsNumber(settings.latestVersion);

  if (versionGotUpdated) {
    // Set the previous sync storage data in the local storage as a backup.
    const previous = await browser.storage.sync.get();
    await browser.storage.local.clear();
    await browser.storage.local.set(previous);

    // Then migrate the sync storage data and update it.
    const next = migrate(settings.latestVersion, previous);
    next.latestVersion = manifest.version;
    next.versionGotUpdated = versionGotUpdated;

    await browser.storage.sync.clear();
    await browser.storage.sync.set(next);
  }

  // Open the options page when:
  // * The extension is first installed or is updated.
  // * In development, for convenience.
  if (versionGotUpdated || manifest.nodeEnv === 'development') {
    await openOptionsPage();
  }
});

async function openOptionsPage() {
  return browser.runtime.openOptionsPage();
}

/**
 * The callback function for custom context menu entries.
 */
function contextCreated() {
  if (
    browser.runtime.lastError !== null &&
    browser.runtime.lastError !== undefined
  ) {
    error(browser.runtime.lastError);
  }
}

const contextMenus: Menus.CreateCreatePropertiesType[] = [
  {
    id: 'queue-add-new-link',
    title: 'Add to Queue',
    contexts: ['link']
  },
  {
    id: 'queue-add-new-link-tab',
    title: 'Add to Queue',
    contexts: ['tab']
  },
  {
    id: 'queue-open-next-link-in-new-tab',
    title: 'Open next link in new tab',
    contexts: ['browser_action']
  },
  {
    id: 'queue-open-options-page',
    title: 'Open the extension page',
    contexts: ['browser_action']
  }
];

const contextMenuIDs: Set<string> = new Set(
  contextMenus.map((value) => value.id!)
);

for (const menu of contextMenus) {
  browser.contextMenus.create(menu, contextCreated);
}

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  const id = info.menuItemId.toString();
  if (!contextMenuIDs.has(id)) {
    return;
  }

  const settings = await getSettings();

  if (id.includes('queue-add-new-link')) {
    let text: string | undefined;
    let url: string;
    if (info.menuItemId === 'queue-add-new-link') {
      text = info.linkText;
      url = info.linkUrl!;
    } else if (info.menuItemId === 'queue-add-new-link-tab') {
      text = tab?.title;
      url = info.pageUrl!;
    } else {
      error(`Unknown menuItemId: ${info.menuItemId}`);
      return;
    }

    settings.queue.push({
      added: new Date(),
      id: newQItemID(settings.queue),
      text: text ?? url,
      url
    });

    await saveSettings(settings);
    await updateBadge(settings);
  } else if (id === 'queue-open-next-link-in-new-tab') {
    const nextItem = await getNextQItem(settings);
    if (nextItem === undefined) {
      await openOptionsPage();
    } else {
      await browser.tabs.create({active: true, url: nextItem.url});
      await removeQItem(nextItem.id);
    }
  } else if (id === 'queue-open-options-page') {
    await openOptionsPage();
  }
});
