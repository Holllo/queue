import {browser} from 'webextension-polyfill-ts';
import {log} from '.';

export type QItem = {
  added: Date;
  id: number;
  text?: string;
  url: string;
};

export type Settings = {
  latestVersion: string;
  queue: QItem[];
};

const defaultSettings: Settings = {
  latestVersion: '0.0.0',
  queue: []
};

/**
 * Returns the user's settings.
 */
export async function getSettings(): Promise<Settings> {
  const syncSettings: any = await browser.storage.sync.get(defaultSettings);

  const queue: QItem[] = syncSettings.queue;

  // Initialize all the non-JSON values, as they are stringified when saved.
  for (const item of queue) {
    item.added = new Date(item.added);
  }

  const settings: Settings = {
    latestVersion: syncSettings.latestVersion,
    queue
  };

  return settings;
}

/**
 * Saves the user's settings to local storage.
 * @param settings The settings to save.
 */
export async function saveSettings(settings: Settings): Promise<Settings> {
  await browser.storage.sync.set(settings);
  return settings;
}

/**
 * Returns a new ID to use for a new QItem.
 * @param items All the queue items.
 */
export function newQItemID(items: QItem[]): number {
  const highestItem = items.sort((a, b) => b.id - a.id)[0];
  if (highestItem === undefined) {
    return 1;
  }

  return highestItem.id + 1;
}

/**
 * Removes a QItem from the Settings with the specified ID.
 * @param id The ID of the QItem to be removed.
 * @param settings Optional user settings to use.
 */
export async function removeQItem(
  id: number,
  settings?: Settings
): Promise<Settings> {
  if (settings === undefined) {
    settings = await getSettings();
  }

  const index = settings.queue.findIndex((item) => item.id === id);
  if (index === -1) {
    log(`No QItem with ID ${id} found.`);
    return settings;
  }

  settings.queue.splice(index, 1);
  return saveSettings(settings);
}

/**
 * Returns the next QItem.
 * @param settings Optional user settings to use.
 */
export async function getNextQItem(
  settings?: Settings
): Promise<QItem | undefined> {
  if (settings === undefined) {
    settings = await getSettings();
  }

  settings.queue.sort((a, b) => a.added.getTime() - b.added.getTime());
  return settings.queue[0];
}
