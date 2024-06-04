import { BigJunctionDataModel } from '../DataModels/BigJunctionDataModel';
import { Action } from './action';

export class DeleteBigJunctionAction extends Action {
  actionName: 'DELETE_BIG_JUNCTION';
  bigJunction: BigJunctionDataModel;

  constructor(bigJunction: BigJunctionDataModel);
}

export function isDeleteBigJunctionAction(
  action: Action,
): action is DeleteBigJunctionAction;
