import { Action } from '@/@waze/Waze/actions/action';
import { MultiAction } from '@/@waze/Waze/actions/multi-action';
import {
  BigJunctionDataModel,
  BigJunctionDataModelAttributes,
} from '@/@waze/Waze/DataModels/BigJunctionDataModel';

export class AddBigJunctionAction extends MultiAction {
  actionName: 'ADD_BIG_JUNCTION';
  bigJunction: BigJunctionDataModel;
  initialGeometry: BigJunctionDataModelAttributes['geometry'];

  constructor(bigJunction: BigJunctionDataModel);
}

export function isAddBigJunctionAction(
  action: Action,
): action is AddBigJunctionAction;
