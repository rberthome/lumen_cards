import type { LoggerAdapter } from "../logger";

export const consoleAdapter: LoggerAdapter = {
  info: (m, meta) => console.info(`[info] ${m}`, meta ?? ""),
  warn: (m, meta) => console.warn(`[warn] ${m}`, meta ?? ""),
  error: (m, meta) => console.error(`[error] ${m}`, meta ?? ""),
};
