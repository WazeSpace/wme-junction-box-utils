import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

export const Action = getWazeMapEditorWindow().require(
  'Waze/Action/MultiAction',
).__proto__.__proto__;
