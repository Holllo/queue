import {log, versionAsNumber} from '../..';
import {migration_2020_11_26} from './2020-11-26';

export type Migration = {
  date: Date;
  version: string;
  upgrade: (previous: Record<string, any>) => Record<string, any>;
};

const migrations: Migration[] = [migration_2020_11_26];

export function migrate(
  latestVersion: string,
  previous: Record<string, any>
): Record<string, any> {
  let next = previous;

  for (const migration of migrations) {
    // If the saved version is >= the version from the migration, we've already
    // handled it previously, so skip it.
    if (versionAsNumber(latestVersion) >= versionAsNumber(migration.version)) {
      continue;
    }

    log(`Running migration ${migration.date.toISOString()}`);
    next = migration.upgrade(next);
  }

  return next;
}
