import {html} from 'htm/preact';
import {Link, QComponent, QManifest, Settings} from '../..';

type FooterProps = {
  manifest: QManifest;
  showVersionUpdated: boolean;
};

export function PageFooter(props: FooterProps): QComponent {
  const version = props.manifest.version;
  const versionLink = html`<${Link}
    text="v${version}"
    url="https://github.com/Holllo/queue/releases/tag/${version}"
  />`;

  const versionUpdated = props.showVersionUpdated ? 'Updated to' : '';

  return html`
    <footer class="page-footer">
      <p>
        ${versionUpdated} ${versionLink} 🄯 Holllo — Free and open-source,
        forever.
      </p>
    </footer>
  `;
}
