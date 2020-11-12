import {html} from 'htm/preact';

type QMessageAction = 'queue open url' | 'queue update badge';

export type QMessage<T> = {
  action: QMessageAction;
  data: T;
};

export type QComponent = ReturnType<typeof html>;

export * from './utilities';
