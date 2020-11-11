import {html} from 'htm/preact';
import {useState} from 'preact/hooks';
import {QComponent} from '../..';

type LinkProps = {
  class: string;
  text: string;
  url: string;
};

/**
 * Creates a new <a/> element with target="_blank" and rel="noopener".
 * @param props The Link properties.
 */
export function Link(props: LinkProps): QComponent {
  return html`
    <a class=${props.class} href=${props.url} target="_blank" rel="noopener">
      ${props.text}
    </a>
  `;
}

type ConfirmButtonProps = {
  // Extra classes to add to the button.
  class: string;
  // The click handler to call when confirmed.
  clickHandler: (event: MouseEvent) => void;
  // The class to add when in the confirm state.
  confirmClass: string;
  // The text to use when in the confirm state.
  confirmText: string;
  // The text to use when in the default state.
  text: string;
  // The timeout for the confirm state to return back to default.
  timeout: number;
  // The title to add to the element.
  title: string;
};

/**
 * Creates a button that requires 2 clicks to trigger the main click handler.
 * @param props The ConfirmButton properties.
 */
export function ConfirmButton(props: ConfirmButtonProps): QComponent {
  let timeoutHandle: number | undefined;

  const [isConfirmed, setIsConfirmed] = useState(false);
  const click = (event: MouseEvent) => {
    if (isConfirmed) {
      clearTimeout(timeoutHandle);
      props.clickHandler(event);
      timeoutHandle = undefined;
      setIsConfirmed(false);
    } else {
      timeoutHandle = window.setTimeout(() => {
        setIsConfirmed(false);
      }, props.timeout);
      setIsConfirmed(true);
    }
  };

  const confirmedClass = isConfirmed ? props.confirmClass : '';
  const text = isConfirmed ? props.confirmText : props.text;
  const title = isConfirmed ? `Confirm ${props.title}` : props.title;

  return html`
    <button
      class="${props.class} ${confirmedClass}"
      onClick=${click}
      title="${title}"
    >
      ${text}
    </button>
  `;
}

export * from './page-footer';
export * from './page-header';
export * from './page-main';
