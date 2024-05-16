import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { getBigJunctionTurns } from '@/utils/wme-entities/big-junction-turns';
import { canUserEditTurnGuidanceForTurn } from '@/utils/wme-entities/turn';

/**
 * Checks whether the user have the required permissions to edit a big junction properties and its respective turns
 * @param bigJunction The big junction in question
 * @returns True if the user has sufficient permissions to edit the properties and turns of it, false otherwise.
 *  Note this does not include other restricted features, i.g. turn guidance, for which use {@link isAllowedToEditBigJunctionTurnGuidance}
 */
export function isAllowedToEditBigJunction(
  bigJunction: BigJunctionDataModel,
): boolean {
  if (!bigJunction) return false;
  return (
    bigJunction.isAllowed(bigJunction.permissionFlags.EDIT_PROPERTIES) &&
    bigJunction.canEditTurns()
  );
}

/**
 * Checks whether a given user is allowed to edit turn guidance for all turns in a given big junction
 * @param bigJunction The big junction in question
 * @param user The user in question. Optional if necessary to check for the current logged in user
 * @returns True if the user is allowed to edit turn guidance for all turns in the given big junction, false othwerise.
 */
export function isAllowedToEditBigJunctionTurnGuidance(
  bigJunction: BigJunctionDataModel,
  user = getWazeMapEditorWindow().W.loginManager.user,
): boolean {
  const turns = getBigJunctionTurns(bigJunction);
  return turns.every((turn) =>
    canUserEditTurnGuidanceForTurn(bigJunction.model, user, turn),
  );
}
