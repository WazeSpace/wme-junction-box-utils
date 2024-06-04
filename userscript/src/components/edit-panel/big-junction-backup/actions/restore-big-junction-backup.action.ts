import { SetTurnAction } from '@/@waze/Waze/actions';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { UpdateBigJunctionAction } from '@/actions';
import { BigJunctionBackup } from '../models';
import {
  UNVERIFIED_TURN_METADATA_SYMBOL,
  WAS_RESTORED_METADATA_SYMBOL,
} from '../constants/meta-symbols';
import {
  omitUnexistingBigJunctionTurns,
  reconcileTurnSegments,
} from '../utils';
import { ChangedIdMapping } from '@/utils';
import { getBigJunctionTurns } from '@/utils/wme-entities/big-junction-turns';
import { reconcileTurnsWithPossibleExtension } from '../utils';

export class RestoreBigJunctionBackupAction extends UpdateBigJunctionAction {
  private _previousSnapshotRestoredState: boolean;
  private _snapshot: BigJunctionBackup;
  private _verifiedTurnIds = new Set<string>();
  private readonly _targetBigJunction: BigJunctionDataModel;
  private readonly _changedSegmentIds: ChangedIdMapping[];

  constructor(
    targetBigJunction: BigJunctionDataModel,
    backup: BigJunctionBackup,
    segmentChangedIds: ChangedIdMapping[],
  ) {
    const name = backup.getName();
    const address = backup.getAddress();
    super(targetBigJunction.model, targetBigJunction, {
      turns: [],
      name,
      cityName: address.isEmpty ? null : address.cityName,
      stateName: address.isEmpty ? null : address.stateName,
      countryName: address.isEmpty ? null : address.countryName,
    });

    this._snapshot = backup;
    this._targetBigJunction = targetBigJunction;
    this._changedSegmentIds = segmentChangedIds;
  }

  private setSnapshotRestoredState(state: boolean) {
    Reflect.defineMetadata(WAS_RESTORED_METADATA_SYMBOL, state, this._snapshot);
  }
  private getSnapshotRestoredState() {
    return (
      Reflect.getMetadata(WAS_RESTORED_METADATA_SYMBOL, this._snapshot) || false
    );
  }

  doAction(dataModel: any): void {
    super.doAction(dataModel);
    const turns = omitUnexistingBigJunctionTurns(
      this._targetBigJunction,
      reconcileTurnsWithPossibleExtension(
        this._snapshot
          .getTurns()
          .map((turn) => reconcileTurnSegments(turn, this._changedSegmentIds)),
        getBigJunctionTurns(this._targetBigJunction),
      ),
    );
    turns.forEach((turn) => {
      this.doSubAction(dataModel, new SetTurnAction(dataModel.turnGraph, turn));
      this._verifiedTurnIds.add(turn.getID());
    });

    this._previousSnapshotRestoredState = this.getSnapshotRestoredState();
    this.setSnapshotRestoredState(true);
    getBigJunctionTurns(this._targetBigJunction)
      .filter((turn) => !this._verifiedTurnIds.has(turn.getID()))
      .forEach((turn) => {
        Reflect.defineMetadata(
          UNVERIFIED_TURN_METADATA_SYMBOL,
          true,
          turn.getTurnData(),
        );
      });
  }

  undoAction(dataModel: any): void {
    super.undoAction(dataModel);
    this.setSnapshotRestoredState(this._previousSnapshotRestoredState);
  }

  redoAction(dataModel: any): void {
    super.redoAction(dataModel);
    this.setSnapshotRestoredState(true);
  }
}
