import { usePreference, useTranslate } from '@/hooks';
import { useNewActionHandler } from '../hooks';
import {
  AddBigJunctionAction,
  isAddBigJunctionAction,
} from '@/@waze/Waze/actions';
import { isBigJunctionOnRoundabout } from '@/utils/wme-entities/big-junction';
import { UpdateBigJunctionGeometryToRoundaboutAction } from '@/actions/update-big-junction-geom-to-roundabout.action';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { useState } from 'react';
import { ConfirmMapBalloon } from '@/components/ConfirmMapBalloon';

function roundaboutizeBigJunctionByAction(action: AddBigJunctionAction) {
  const dataModel = getWazeMapEditorWindow().W.model;
  const map = getWazeMapEditorWindow().W.map;
  dataModel.actionManager.add(
    new UpdateBigJunctionGeometryToRoundaboutAction(action, dataModel, map),
  );
}

export function AutoCloneRoundaboutGeometryBackgroundAction() {
  const [pref, setPref] = usePreference('roundabout.clone_geometry');
  const t = useTranslate();
  const [actionToAskFor, setActionToAskFor] = useState<AddBigJunctionAction>();

  const isEnabled = pref !== false;
  const askBeforePerforming = pref === 'ask';

  useNewActionHandler(
    (action) => {
      // this action handler should only run for new big junctions on roundabouts
      if (!isAddBigJunctionAction(action)) return;
      if (!isBigJunctionOnRoundabout(action.bigJunction)) return;

      // if the user decided to disable the preference altogether
      if (!isEnabled) return;
      if (!askBeforePerforming) return roundaboutizeBigJunctionByAction(action);
      setActionToAskFor(action);
    },
    [pref, setPref],
  );

  const saveUserPreferenceIfRequested = (
    preferenceValue: boolean,
    dontShowAgain: boolean,
  ) => {
    if (!dontShowAgain) return;
    setPref(preferenceValue);
  };

  const handleButtonClick = (
    applyGeometry: boolean,
    dontShowAgain: boolean,
  ) => {
    saveUserPreferenceIfRequested(applyGeometry, dontShowAgain);
    if (applyGeometry) roundaboutizeBigJunctionByAction(actionToAskFor);
    setActionToAskFor(null);
  };

  if (!actionToAskFor) return null;
  return (
    <ConfirmMapBalloon
      mapEntity={actionToAskFor.bigJunction}
      title={t(
        'jb_utils.big_junction.auto_clone_roundabout_geom_confirm.title',
      )}
      details={t(
        'jb_utils.big_junction.auto_clone_roundabout_geom_confirm.details',
      )}
      confirmButtonText={t('formats.boolean.is_true')}
      cancelButtonText={t('formats.boolean.is_false')}
      onConfirmClick={(dsa) => handleButtonClick(true, dsa)}
      onCancelClick={(dsa) => handleButtonClick(false, dsa)}
    />
  );
}
