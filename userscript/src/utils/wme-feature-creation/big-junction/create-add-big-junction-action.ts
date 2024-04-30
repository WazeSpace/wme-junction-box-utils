import { Polygon } from '@turf/helpers';
import { drawBigJunction } from './draw-big-junction';
import { getActionsCreatedInContext } from '@/utils/wme-action-manager';
import {
  AddBigJunctionAction,
  isAddBigJunctionAction,
} from '@/@waze/Waze/actions';

export function createAddBigJunctionAction(
  polygon: Polygon,
): AddBigJunctionAction {
  const actions = getActionsCreatedInContext(() => {
    drawBigJunction(polygon);
  });
  return actions.find((action) =>
    isAddBigJunctionAction(action),
  ) as AddBigJunctionAction;
}
