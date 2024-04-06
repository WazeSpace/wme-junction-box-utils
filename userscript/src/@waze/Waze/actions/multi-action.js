import { getWazeMapEditorWindow } from '../../../utils/get-wme-window';

export const MultiAction = getWazeMapEditorWindow().require(
  'Waze/Action/MultiAction',
);
MultiAction.Base = MultiAction.__proto__;
