import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { BigJunctionBackupSnapshot } from '../backup-snapshot';
import { useMemo } from 'react';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { canUserEditTurnGuidanceForTurn } from '@/utils/wme-entities/turn';
import { RestoreBigJunctionSnapshotAction } from '../restore-big-junction-snapshot.action';
import { BigJunctionSignature } from '@/types/big-junction-signature';

export function useBigJunctionRestorer(
  destBigJunction: BigJunctionDataModel,
  backupSnapshot: BigJunctionBackupSnapshot,
) {
  const upgradedLineageSignature = useMemo(
    () => backupSnapshot?.signature?.upgradeSignatureSegmentsLineage?.(),
    [backupSnapshot?.signature],
  );
  const dataModel = destBigJunction.model;

  const isBigJunctionSignatureMatch = useMemo(
    () =>
      destBigJunction &&
      upgradedLineageSignature &&
      BigJunctionSignature.fromBigJunction(destBigJunction).compareTo(
        upgradedLineageSignature,
      ),
    [upgradedLineageSignature, destBigJunction],
  );

  const canEditBigJunction = useMemo(
    () =>
      destBigJunction?.isAllowed?.(
        destBigJunction.permissionFlags.EDIT_PROPERTIES,
      ) && destBigJunction?.canEditTurns?.(),
    [destBigJunction],
  );
  const canEditTurnGuidance = useMemo(() => {
    const turns = destBigJunction?.getShortestTurns?.(dataModel);
    const user = getWazeMapEditorWindow().W.loginManager.user;
    return turns?.every?.((turn) =>
      canUserEditTurnGuidanceForTurn(dataModel, user, turn),
    );
  }, [dataModel, destBigJunction]);
  const hasTurnsWithGuidance = useMemo(
    () =>
      backupSnapshot?.turns?.some?.((turn) => turn.turnData.hasTurnGuidance()),
    [backupSnapshot?.turns],
  );

  return {
    available: Boolean(destBigJunction && backupSnapshot),
    isBigJunctionSignatureMatch,
    canEditBigJunction,
    canEditTurnGuidance,
    hasTurnsWithGuidance,
    restore() {
      getWazeMapEditorWindow().W.model.actionManager.add(
        new RestoreBigJunctionSnapshotAction(
          dataModel,
          destBigJunction,
          backupSnapshot,
        ),
      );
    },
    restorationUnavailableReason: (() => {
      if (!isBigJunctionSignatureMatch) return 'SIGNATURE_MISMATCH';
      if (!canEditBigJunction) return 'BIG_JUNCTION_EDITING_DISALLOWED';
      if (!canEditTurnGuidance && hasTurnsWithGuidance)
        return 'TURN_GUIDANCE_EDITING_DISALLOWED';
      return null;
    })(),
  };
}
