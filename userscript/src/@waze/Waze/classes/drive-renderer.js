import { getWazeMapEditorWindow } from '../../../utils/get-wme-window';

function getDriveRendererConstructor() {
  const driveRendererInstance =
    getWazeMapEditorWindow().W.map.driveLayerController.driveRenderer;
  if (!driveRendererInstance)
    throw new Error('DriveRenderer instance not found');

  return Object.getPrototypeOf(driveRendererInstance).constructor;
}
export const DriveRenderer = getDriveRendererConstructor();
