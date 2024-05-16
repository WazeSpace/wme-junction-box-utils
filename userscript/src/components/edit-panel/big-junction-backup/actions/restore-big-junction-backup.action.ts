import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { UpdateBigJunctionAction } from '@/actions';
import { BigJunctionBackup } from '../models';
import { WAS_RESTORED_METADATA_SYMBOL } from '../constants/meta-symbols';
import { reconcileTurnSegments } from '../utils';
import { ChangedIdMapping } from '@/utils';

export class RestoreBigJunctionBackupAction extends UpdateBigJunctionAction {
  private _previousSnapshotRestoredState: boolean;
  private _snapshot: BigJunctionBackup;

  constructor(
    targetBigJunction: BigJunctionDataModel,
    backup: BigJunctionBackup,
    segmentChangedIds: ChangedIdMapping[],
  ) {
    const name = backup.getName();
    const address = backup.getAddress();
    const turns = backup
      .getTurns()
      .map((turn) => reconcileTurnSegments(turn, segmentChangedIds));

    super(targetBigJunction.model, targetBigJunction, {
      turns,
      name,
      cityName: address.isEmpty ? null : address.cityName,
      stateName: address.isEmpty ? null : address.stateName,
      countryName: address.isEmpty ? null : address.countryName,
    });

    this._snapshot = backup;
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
    this._previousSnapshotRestoredState = this.getSnapshotRestoredState();
    this.setSnapshotRestoredState(true);
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
