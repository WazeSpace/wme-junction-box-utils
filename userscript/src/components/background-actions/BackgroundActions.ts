import {
  AddBigJunctionAction,
  isAddBigJunctionAction,
} from '@/@waze/Waze/actions';
import { UpdateBigJunctionGeometryToRoundaboutAction } from '@/actions';
import { useNewActionHandler } from '@/components/background-actions/hooks';
import { usePreferences, useTranslate } from '@/hooks';
import { createSetPreferenceAction } from '@/preferences/actions';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { isBigJunctionOnRoundabout } from '@/utils/wme-entities/big-junction';
import { ReactElement } from 'react';

function roundaboutizeBigJunctionByAction(action: AddBigJunctionAction) {
  const dataModel = getWazeMapEditorWindow().W.model;
  const map = getWazeMapEditorWindow().W.map;
  dataModel.actionManager.add(
    new UpdateBigJunctionGeometryToRoundaboutAction(action, dataModel, map),
  );
}

export function BackgroundActions(): ReactElement {
  const [preferences, dispatchPreferences] = usePreferences();
  const t = useTranslate();

  useNewActionHandler(
    (action) => {
      if (!isAddBigJunctionAction(action)) return;
      if (!isBigJunctionOnRoundabout(action.bigJunction)) return;

      if (preferences.roundabout.clone_geometry === false) return;
      if (preferences.roundabout.clone_geometry === 'ask') {
        const question = t(
          'jb_utils.big_junction.auto_clone_roundabout_geom_confirm.details',
        );
        const response = confirm(question);
        dispatchPreferences(
          createSetPreferenceAction('roundabout.clone_geometry', response),
        );
        if (!response) return;
      }

      roundaboutizeBigJunctionByAction(action);
    },
    [preferences, dispatchPreferences],
  );

  return null;
}
