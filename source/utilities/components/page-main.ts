import {html} from 'htm/preact';
import {useState} from 'preact/hooks';
import {browser} from 'webextension-polyfill-ts';
import {
  ConfirmButton,
  Link,
  QComponent,
  QItem,
  removeQItem,
  Settings
} from '../..';

type MainProps = {
  settings: Settings;
};

export function PageMain(props: MainProps): QComponent {
  const [queue, updateQueue] = useState(props.settings.queue);

  const _removeQItem = async (id: number) => {
    const updated = await removeQItem(id);
    updateQueue(updated.queue);
    await browser.runtime.sendMessage({action: 'queue update badge'});
  };

  const qItems: QComponent[] = queue
    .sort((a, b) => a.added.getTime() - b.added.getTime())
    .map((item) => html`<${Item} item=${item} remove=${_removeQItem} />`);

  if (qItems.length === 0) {
    qItems.push(html`<li>No items queued. 🤷</li>`);
  }

  return html`
    <main class="page-main">
      <ul class="q-list">
        ${qItems}
      </ul>

      <details class="usage">
        <summary>How do I use Queue?</summary>

        <p>Adding links to your queue:</p>
        <ul>
          <li>Right-click any link or tab and click "Add to Queue".</li>
        </ul>

        <p>Opening the next link from your queue:</p>
        <ul>
          <li>
            Click on the extension icon to open it in the current tab (when
            possible).
          </li>
          <li>
            Right-click the extension icon and click "Open next link in new
            tab".
          </li>
        </ul>

        <p>Opening the extension page:</p>
        <ul>
          <li>Double-click the extension icon.</li>
          <li>
            Right-click the extension icon and click "Open the extension page".
          </li>
        </ul>

        <p>Deleting queue items:</p>
        <ul>
          <li>
            Click the red button with the ✗ and then confirm it by clicking
            again.
          </li>
        </ul>
      </details>
    </main>
  `;
}

type ItemProps = {
  item: QItem;
  remove: (id: number) => Promise<void>;
};

function Item(props: ItemProps): QComponent {
  const {added, id, text, url} = props.item;

  return html`
    <li class="q-item">
      <p class="title">
        <${Link} text=${text ?? url} url=${url} />
      </p>

      <div class="buttons">
        <${ConfirmButton}
          class="confirm-button"
          clickHandler=${async () => props.remove(id)}
          confirmClass="confirm"
          confirmText="✓"
          text="✗"
          timeout=${5 * 1000}
          title="Remove"
        />
      </div>

      <p>
        <time
          datetime=${added.toLocaleString()}
          title="Link queued on ${added.toLocaleString()}."
        >
          ${added.toLocaleString()}
        </time>
      </p>
    </li>
  `;
}
