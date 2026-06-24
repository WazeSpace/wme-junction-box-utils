import { LogStream } from '@editor-x/wme-logstream';

// noinspection JSUnusedGlobalSymbols

const logStreamInstance = LogStream.create({
  minLogLevel: 'DEBUG',
  persist: true,
  dbPrefix: 'WMEJBU_DB',
  scriptVersion: process.env.VERSION || '2.4.0',
  wmeSDK: (window as any).SDK_INITIALIZED ? (window as any).WazeMapEditorSDK : undefined,
  brand: {
    prefix: process.env.SCRIPT_NAME || 'JBU',
    color: '#00E676',
  },
});

export class Logger {
  static logStream = logStreamInstance;

  static log = (...data: any[]) => logStreamInstance.info(...data);
  static warn = (...data: any[]) => logStreamInstance.warn(...data);
  static error = (...data: any[]) => logStreamInstance.error(...data);
  static info = (...data: any[]) => logStreamInstance.info(...data);
  static debug = (...data: any[]) => logStreamInstance.debug(...data);

  static scope(scopeName: string) {
    return logStreamInstance.scope(scopeName);
  }

  static downloadLogs(filename?: string) {
    return logStreamInstance.downloadLogs(filename || 'wme-jbu-logs.zip');
  }
}
