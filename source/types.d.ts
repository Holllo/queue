// TypeScript fix to make it see this file as a module.
export {};

type HollloQueue = {
  dumpBackup: () => Promise<void>;
  dumpSettings: () => Promise<void>;
};

declare global {
  interface Window {
    HollloQueue: HollloQueue;
  }
}
