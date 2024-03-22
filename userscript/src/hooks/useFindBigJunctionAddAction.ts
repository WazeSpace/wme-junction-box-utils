import {
  Action,
  AddBigJunctionAction,
  isAddBigJunctionAction,
} from '@/@waze/Waze/actions';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { useMemo } from 'react';

export function useFindBigJunctionAddAction(
  bigJunction: BigJunctionDataModel,
): AddBigJunctionAction {
  const actionManager = getWazeMapEditorWindow().W.model.actionManager;
  const latestActions: Action[] = actionManager.getActions();
  return useMemo(() => {
    return latestActions.find(
      (action) =>
        isAddBigJunctionAction(action) && action.bigJunction === bigJunction,
    ) as AddBigJunctionAction;
  }, [bigJunction, latestActions]);
}
