import {Migration, QItem} from '../..';

export const migration_2020_11_26: Migration = {
  date: new Date('2020-11-26T14:32:00.000Z'),
  version: '0.1.7',
  upgrade
};

/**
 * This upgrades the sync settings to use 'qi<ID>'-named objects for QItems instead
 * of them being in an array.
 * Relevant commit: a668da05a179851b2a1117ef2d6aa9cef48d4964
 */
function upgrade(previous: Record<string, any>): Record<string, any> {
  const items: QItem[] = previous.queue ?? [];
  const next: Record<string, any> = previous;
  delete next.queue;

  for (const item of items) {
    next['qi' + item.id.toString()] = item;
  }

  return next;
}
