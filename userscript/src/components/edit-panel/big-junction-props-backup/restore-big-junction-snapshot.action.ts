import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { UpdateBigJunctionAction } from '@/actions';
import { BigJunctionBackupSnapshot } from './backup-snapshot';
import { WAS_RESTORED_METADATA_SYMBOL } from './consts';

export class RestoreBigJunctionSnapshotAction extends UpdateBigJunctionAction {
  private _previousSnapshotRestoredState: boolean;

  constructor(
    dataModel: any,
    bigJunction: BigJunctionDataModel,
    private readonly _snapshot: BigJunctionBackupSnapshot,
  ) {
    super(dataModel, bigJunction, {
      turns: _snapshot.turns,
      name: _snapshot.name,
      cityName: _snapshot.address.city,
      stateName: _snapshot.address.state,
      countryName: _snapshot.address.country,
    });
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
