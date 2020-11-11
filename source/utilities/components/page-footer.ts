import {html} from 'htm/preact';
import {Link, QComponent, QManifest} from '../..';

type FooterProps = {
  manifest: QManifest;
};

export function PageFooter(props: FooterProps): QComponent {
  const version = props.manifest.version;
  const versionLink = html`<${Link}
    text="v${version}"
    url="https://github.com/Holllo/queue/releases/tag/${version}"
  />`;

  return html`
    <footer class="page-footer">
      <p>
        ${versionLink} 🄯 Holllo — Free and open-source, forever.
      </p>
    </footer>
  `;
}
