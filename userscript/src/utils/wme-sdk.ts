import { WmeSDK } from 'wme-sdk-typings';
import { getWazeMapEditorWindow } from './get-wme-window';

export const wmeSdk: WmeSDK = getWazeMapEditorWindow().getWmeSdk({
  scriptId: process.env.SCRIPT_ID,
  scriptName: process.env.SCRIPT_NAME,
});
