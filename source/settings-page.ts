import {html, render} from 'htm/preact';
import {
  initializeBackgroundMessageHandler,
  log,
  getManifest,
  getSettings,
  PageFooter,
  PageHeader,
  PageMain,
  saveSettings
} from '.';

(async () => {
  initializeBackgroundMessageHandler();

  window.HollloQueue = {
    dumpBackup: async () => {
      log(JSON.stringify(await browser.storage.local.get(), null, 2));
    },
    dumpSettings: async () => {
      log(JSON.stringify(await getSettings(), null, 2));
    }
  };

  const manifest = getManifest();
  const settings = await getSettings();

  const showVersionUpdated = settings.versionGotUpdated;
  if (showVersionUpdated) {
    settings.versionGotUpdated = false;
    await saveSettings(settings);
  }

  render(
    html`
      <${PageHeader} />
      <${PageMain} settings=${settings} />
      <${PageFooter}
        manifest=${manifest}
        showVersionUpdated=${showVersionUpdated}
      />
    `,
    document.body
  );
})();
