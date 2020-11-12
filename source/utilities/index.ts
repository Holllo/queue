import {browser, Manifest} from 'webextension-polyfill-ts';
import {getSettings, QItem, QMessage, Settings} from '..';

/**
 * Initializes the background message handler.
 */
export function initializeBackgroundMessageHandler() {
  browser.runtime.onMessage.addListener((request: QMessage<unknown>) => {
    if (request.action === 'queue open url') {
      // TypeScript can't assign QMessage<unknown> to QMessage<QItem> but since
      // we know it's correct, just ignore the error.
      // @ts-expect-error
      const message: QMessage<QItem> = request;
      window.location.href = message.data.url;
    }
  });
}

/**
 * The WebExtension Manifest with an extra nodeEnv property.
 */
export type QManifest = {nodeEnv?: string} & Manifest.ManifestBase;

/**
 * Returns the WebExtension Manifest.
 */
export function getManifest(): QManifest {
  const manifest: Manifest.ManifestBase = browser.runtime.getManifest();
  return {...manifest};
}

/**
 * Logs a thing in the console in the debug level.
 * @param thing The thing to log.
 */
export function log(thing: unknown) {
  console.debug('[Queue]', thing);
}

/**
 * Logs a thing in the console in the error level.
 * @param thing The thing to log.
 */
export function error(thing: unknown) {
  console.error('[Queue]', thing);
}

/**
 * Updates the extension icon badge with the number of saved items. This can
 * only be run from the background script.
 * @param settings Optional user settings to use.
 */
export async function updateBadge(settings?: Settings): Promise<void> {
  if (settings === undefined) {
    settings = await getSettings();
  }

  let text: string | null = null;
  if (settings.queue.length > 0) {
    text = settings.queue.length.toString();
  }

  await Promise.all([
    browser.browserAction.setBadgeBackgroundColor({
      color: '#2a2041'
    }),
    browser.browserAction.setBadgeTextColor({
      color: '#f2efff'
    }),
    browser.browserAction.setBadgeText({
      text
    })
  ]);
}

export * from './components';
export * from './settings';
