import { isAddBigJunctionAction } from '@/@waze/Waze/actions';
import { UpdateBigJunctionGeometryToRoundaboutAction } from '@/actions';
import { useNewActionHandler } from '@/components/background-actions/hooks';
import { usePreferences } from '@/hooks';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { ReactElement } from 'react';

export function BackgroundActions(): ReactElement {
  const [preferences] = usePreferences();

  useNewActionHandler((action) => {
    if (!preferences.roundabout.clone_geometry) return;
    if (!isAddBigJunctionAction(action)) return;
    if (
      !action.bigJunction
        .getShortSegments()
        .every((segment) => segment.isInRoundabout())
    ) {
      return;
    }

    const dataModel = getWazeMapEditorWindow().W.model;
    const map = getWazeMapEditorWindow().W.map;
    dataModel.actionManager.add(
      new UpdateBigJunctionGeometryToRoundaboutAction(action, dataModel, map),
    );
  });

  return null;
}
