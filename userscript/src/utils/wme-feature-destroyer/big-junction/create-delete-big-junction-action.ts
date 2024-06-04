import { DeleteBigJunctionAction } from '@/@waze/Waze/actions';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { getDeleteBigJunctionActionProto } from '@/utils/wme-feature-destroyer/big-junction/get-delete-big-junction-action-proto';

export function createDeleteBigJunctionAction(
  bigJunction: BigJunctionDataModel,
): DeleteBigJunctionAction {
  const deleteBigJunctionProto = getDeleteBigJunctionActionProto();
  return new deleteBigJunctionProto(bigJunction);
}
