import {browser} from 'webextension-polyfill-ts';
import {initializeBackgroundMessageHandler} from '.';

initializeBackgroundMessageHandler();

(async () => {
  await browser.runtime.sendMessage({action: 'queue update badge'});
})();
