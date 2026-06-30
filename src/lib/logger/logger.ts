import { consoleAdapter } from "./adapters/consoleAdapter";

export interface LoggerAdapter {
  info(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
}

// Adapter par défaut : console. Un sentryAdapter pourra l'implémenter plus tard.
export const logger: LoggerAdapter = consoleAdapter;
