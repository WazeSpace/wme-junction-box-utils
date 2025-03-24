import { getWazeMapEditorWindow } from './get-wme-window';

export const wmeSdk = getWazeMapEditorWindow().getWmeSdk({
  scriptId: process.env.SCRIPT_ID,
  scriptName: process.env.SCRIPT_NAME,
});
