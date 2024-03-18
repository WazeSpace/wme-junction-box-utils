import { getWazeMapEditorWindow } from '../../../utils/get-wme-window';

export const SetTurnAction = getWazeMapEditorWindow().require(
  'Waze/Model/Graph/Actions/SetTurn',
);
