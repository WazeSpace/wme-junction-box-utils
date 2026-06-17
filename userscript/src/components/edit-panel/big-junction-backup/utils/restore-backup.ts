import { SetTurnAction } from '@/@waze/Waze/actions';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { BigJunctionBackup } from '../models';
import {
  UNVERIFIED_TURN_METADATA_SYMBOL,
  WAS_RESTORED_METADATA_SYMBOL,
} from '../constants/meta-symbols';
import {
  omitUnexistingBigJunctionTurns,
  reconcileTurnSegments,
  reconcileTurnsWithPossibleExtension,
} from '../utils';
import { ChangedIdMapping } from '@/utils';
import { getBigJunctionTurns } from '@/utils/wme-entities/big-junction-turns';
import { wmeSdk } from '@/utils/wme-sdk';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { doAsyncMultipleActions } from './do-async-multiple-functions';

export async function restoreBigJunctionBackup(
  targetBigJunction: BigJunctionDataModel,
  backup: BigJunctionBackup,
  segmentChangedIds: ChangedIdMapping[],
  wrapInMultiAtion: boolean = true,
) {
  const bigJunctionId = targetBigJunction.getAttribute('id');
  const address = backup.getAddress();
  const cityId = address.cityId;

  const localizedDescription = getWazeMapEditorWindow().I18n.t(
    'jb_utils.save.changes_log.actions.UpdateBigJunction',
  );

  const performActions = async () => {
    // 1. Update Name
    (wmeSdk.DataModel.BigJunctions as any).updateBigJunction({
      bigJunctionId,
      name: backup.getName(),
    });

    // 2. Update Address
    if (address.cityId) {
      await (wmeSdk.DataModel.BigJunctions as any).updateAddress({
        bigJunctionId,
        cityId,
      });
    }

    // 3. Update Turns
    const dataModel = getWazeMapEditorWindow().W.model;
    const turns = omitUnexistingBigJunctionTurns(
      targetBigJunction,
      reconcileTurnsWithPossibleExtension(
        backup
          .getTurns()
          .map((turn) => reconcileTurnSegments(turn, segmentChangedIds)),
        getBigJunctionTurns(targetBigJunction),
      ),
    );

    const verifiedTurnIds = new Set<string>();
    turns.forEach((turn) => {
      dataModel.actionManager.add(new SetTurnAction(dataModel.turnGraph, turn));
      verifiedTurnIds.add(turn.getID());
    });

    // 4. Custom virtual action to toggle WAS_RESTORED_METADATA_SYMBOL on backup
    (wmeSdk.Editing as any).doCustomAction({
      description: '',
      affectedObjects: [],
      do: () => {
        Reflect.defineMetadata(WAS_RESTORED_METADATA_SYMBOL, true, backup);
      },
      undo: () => {
        Reflect.defineMetadata(WAS_RESTORED_METADATA_SYMBOL, false, backup);
      },
    });

    // 5. Custom virtual action to apply UNVERIFIED_TURN_METADATA_SYMBOL to active turns
    const unverifiedTurnDataObjects = getBigJunctionTurns(targetBigJunction)
      .filter((turn) => !verifiedTurnIds.has(turn.getID()))
      .map((turn) => turn.getTurnData())
      .filter(Boolean);

    if (unverifiedTurnDataObjects.length > 0) {
      (wmeSdk.Editing as any).doCustomAction({
        description: '',
        affectedObjects: [],
        do: () => {
          unverifiedTurnDataObjects.forEach((turnData) => {
            Reflect.defineMetadata(
              UNVERIFIED_TURN_METADATA_SYMBOL,
              true,
              turnData,
            );
          });
        },
        undo: () => {
          unverifiedTurnDataObjects.forEach((turnData) => {
            Reflect.deleteMetadata(UNVERIFIED_TURN_METADATA_SYMBOL, turnData);
          });
        },
      });
    }
  };

  if (wrapInMultiAtion) {
    await doAsyncMultipleActions(wmeSdk, performActions, localizedDescription);
  } else {
    await performActions();
  }
}
