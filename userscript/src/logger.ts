import { LogStream } from '@TheEditorX/wme-logstream';

export const logStream = LogStream.create({
  minLogLevel: 'DEBUG',
  persist: true,
  dbPrefix: process.env.SCRIPT_ID.replace('/', '-'),
  scriptVersion: process.env.VERSION,
  brand: {
    scriptPrefix: process.env.SCRIPT_NAME ?? 'Junction Box Utils',
  },
});

function formatLogStreamArgs(args: any[]): { message: string; data?: any } {
  if (args.length === 0) {
    return { message: '' };
  }
  if (typeof args[0] === 'string') {
    const message = args[0];
    if (args.length === 2) {
      return { message, data: args[1] };
    } else if (args.length > 2) {
      return { message, data: args.slice(1) };
    }
    return { message };
  }
  if (args.length === 1) {
    return { message: '', data: args[0] };
  }
  return { message: '', data: args };
}

/**
 * @deprecated Use `logStream` from `@/logger` (or `@TheEditorX/wme-logstream`) instead.
 */
// noinspection JSUnusedGlobalSymbols
export class Logger {
  /**
   * @deprecated Use `logStream.info()` instead.
   */
  static log(...args: any[]) {
    const { message, data } = formatLogStreamArgs(args);
    logStream.info(message, data);
  }

  /**
   * @deprecated Use `logStream.info()` instead.
   */
  static info(...args: any[]) {
    const { message, data } = formatLogStreamArgs(args);
    logStream.info(message, data);
  }

  /**
   * @deprecated Use `logStream.warn()` instead.
   */
  static warn(...args: any[]) {
    const { message, data } = formatLogStreamArgs(args);
    logStream.warn(message, data);
  }

  /**
   * @deprecated Use `logStream.error()` instead.
   */
  static error(...args: any[]) {
    const { message, data } = formatLogStreamArgs(args);
    logStream.error(message, data);
  }

  /**
   * @deprecated Use `logStream.debug()` instead.
   */
  static debug(...args: any[]) {
    const { message, data } = formatLogStreamArgs(args);
    logStream.debug(message, data);
  }
}

export { LogStream };
