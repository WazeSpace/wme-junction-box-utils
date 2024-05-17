import { getWazeMapEditorWindow } from '../../../utils/get-wme-window';

function getDriveRendererConstructor() {
  const driveRendererInstance =
    getWazeMapEditorWindow().W.map.driveLayerController.driveRenderer;
  return Object.getPrototypeOf(driveRendererInstance).constructor;
}
export const DriveRenderer = getDriveRendererConstructor();
