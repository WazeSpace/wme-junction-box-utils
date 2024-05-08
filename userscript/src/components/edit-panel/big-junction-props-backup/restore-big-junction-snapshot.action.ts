import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { UpdateBigJunctionAction } from '@/actions';
import {
  BigJunctionBackupSnapshot,
  updateSnapshotWithSegmentLineage,
} from './backup-snapshot';
import { WAS_RESTORED_METADATA_SYMBOL } from './consts';

export class RestoreBigJunctionSnapshotAction extends UpdateBigJunctionAction {
  private _previousSnapshotRestoredState: boolean;

  constructor(
    dataModel: any,
    bigJunction: BigJunctionDataModel,
    private readonly _snapshot: BigJunctionBackupSnapshot,
  ) {
    const upgradedSnapshot = updateSnapshotWithSegmentLineage(_snapshot);
    super(dataModel, bigJunction, {
      turns: upgradedSnapshot.turns.filter((turn) =>
        dataModel.turnGraph.hasTurn(turn),
      ),
      name: upgradedSnapshot.name,
      cityName: upgradedSnapshot.address.city,
      stateName: upgradedSnapshot.address.state,
      countryName: upgradedSnapshot.address.country,
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
