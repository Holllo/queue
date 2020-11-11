import {browser, Manifest} from 'webextension-polyfill-ts';
import {QItem, QMessage} from '..';

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

export * from './components';
export * from './settings';
