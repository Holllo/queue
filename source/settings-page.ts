import {html, render} from 'htm/preact';
import {
  initializeBackgroundMessageHandler,
  getManifest,
  getSettings,
  PageFooter,
  PageHeader,
  PageMain
} from '.';

(async () => {
  initializeBackgroundMessageHandler();

  const manifest = getManifest();
  const settings = await getSettings();

  render(
    html`
      <${PageHeader} />
      <${PageMain} settings=${settings} />
      <${PageFooter} manifest=${manifest} />
    `,
    document.body
  );
})();
