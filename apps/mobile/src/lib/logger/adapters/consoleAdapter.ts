import type { Logger } from '../logger';

export const consoleAdapter: Logger = {
  info: (msg, meta) => console.log(`[INFO] ${msg}`, meta ?? ''),
  warn: (msg, meta) => console.warn(`[WARN] ${msg}`, meta ?? ''),
  error: (msg, err, meta) => console.error(`[ERROR] ${msg}`, err ?? '', meta ?? ''),
};
