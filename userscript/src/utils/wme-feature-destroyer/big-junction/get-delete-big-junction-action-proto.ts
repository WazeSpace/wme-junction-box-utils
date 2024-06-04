import {
  DeleteBigJunctionAction,
  isDeleteBigJunctionAction,
} from '@/@waze/Waze/actions';
import { getActionsCreatedInContext } from '@/utils/wme-action-manager';
import { createAddBigJunctionAction } from '@/utils/wme-feature-creation';
import { getDeleteFeatureFunction } from '@/utils/wme-feature-destroyer';
import { polygon } from '@turf/helpers';

let deleteBigJunctionAction: typeof DeleteBigJunctionAction = null;

export function getDeleteBigJunctionActionProto(): typeof DeleteBigJunctionAction {
  if (deleteBigJunctionAction) return deleteBigJunctionAction;

  const addedActions = getActionsCreatedInContext(() => {
    const addBigJunctionAction = createAddBigJunctionAction(
      polygon([
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 0],
        ],
      ]).geometry,
    );
    const deleteFeatures = getDeleteFeatureFunction();
    deleteFeatures([addBigJunctionAction.bigJunction]);
  });
  deleteBigJunctionAction = Object.getPrototypeOf(
    addedActions.find((action) => isDeleteBigJunctionAction(action)),
  ).constructor;
  return deleteBigJunctionAction;
}
