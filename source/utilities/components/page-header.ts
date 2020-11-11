import {html} from 'htm/preact';
import {QComponent} from '../..';

export function PageHeader(): QComponent {
  return html`
    <header class="page-header">
      <h1>
        <span class="icon">⇥</span>
        Queue
      </h1>
    </header>
  `;
}
