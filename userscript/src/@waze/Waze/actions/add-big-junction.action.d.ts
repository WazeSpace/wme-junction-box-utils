import { Action } from '@/@waze/Waze/actions/action';
import { MultiAction } from '@/@waze/Waze/actions/multi-action';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';

export class AddBigJunctionAction extends MultiAction {
  actionName: 'ADD_BIG_JUNCTION';
  bigJunction: BigJunctionDataModel;
  __jbuSkipAutoRoundaboutize: boolean;

  constructor(bigJunction: BigJunctionDataModel);
}

export function isAddBigJunctionAction(
  action: Action,
): action is AddBigJunctionAction;
