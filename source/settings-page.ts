import {html, render} from 'htm/preact';
import {
  initializeBackgroundMessageHandler,
  getManifest,
  getSettings,
  PageFooter,
  PageHeader,
  PageMain,
  saveSettings
} from '.';

(async () => {
  initializeBackgroundMessageHandler();

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
