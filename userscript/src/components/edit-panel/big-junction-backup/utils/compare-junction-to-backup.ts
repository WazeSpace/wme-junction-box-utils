import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { BigJunctionBackup } from '../models';
import { getBigJunctionTurns } from '@/utils/wme-entities/big-junction-turns';

export function compareJunctionToBackup(
  bigJunction: BigJunctionDataModel,
  backup: BigJunctionBackup,
): boolean {
  const bigJunctionTurns = getBigJunctionTurns(bigJunction);
  const backupTurns = backup.getTurns();
  const hasCommonTurns = backupTurns.some((backupTurn) => {
    return bigJunctionTurns.some((bigJunctionTurn) => {
      const sameFrom =
        bigJunctionTurn.fromVertex.getID() === backupTurn.fromVertex.getID();
      const sameTo =
        bigJunctionTurn.toVertex.getID() === backupTurn.toVertex.getID();
      return sameFrom && sameTo;
    });
  });
  return hasCommonTurns;
}
