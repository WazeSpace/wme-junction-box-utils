// noinspection JSUnusedGlobalSymbols
export class Logger {
  private static get displayName() {
    return process.env.SCRIPT_NAME;
  }

  private static addDisplayNameToDataComponent(message: string | null) {
    const prefix = `[${Logger.displayName}]`;
    if (!message) return prefix;
    return `${prefix} ${message}`;
  }

  private static formatData(...args: any[]): [string, ...any] {
    if (args.length === 0) return null;
    if (typeof args[0] === 'string') {
      const [textArgument, ...rest] = args;
      return [this.addDisplayNameToDataComponent(textArgument), ...rest];
    }

    return [this.addDisplayNameToDataComponent(null), ...args];
  }

  private static logLevel(level: string, ...data: any[]) {
    if (typeof console[level] !== 'function') {
      throw new Error(`Logging level "${level}" is not supported`);
    }

    const formattedData = Logger.formatData(...data);
    return console[level](...formattedData);
  }

  private static bindLogLevel(level: string) {
    return (...data: any[]) => this.logLevel(level, ...data);
  }

  static log = Logger.bindLogLevel('log');
  static warn = Logger.bindLogLevel('warn');
  static error = Logger.bindLogLevel('error');
  static info = Logger.bindLogLevel('info');
  static debug = Logger.bindLogLevel('debug');
}
