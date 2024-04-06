import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { UpdateBigJunctionAction } from '@/actions';
import { Logger } from '@/logger';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { Memoize } from 'typescript-memoize';
import { BigJunctionBackupSnapshot } from './backup-snapshot';
import { canUserEditTurnGuidanceForTurn } from '@/utils/wme-entities/turn';
import { BigJunctionSignature } from '@/types/big-junction-signature';

interface BigJunctionRestorerOptions {
  allowMismatchSignatureRestoration?: boolean;
}

const DEFAULT_RESTORER_OPTIONS: BigJunctionRestorerOptions = {
  allowMismatchSignatureRestoration: false,
};

export class BigJunctionRestorer implements Disposable {
  private readonly _destinationBigJunction: BigJunctionDataModel;
  private readonly _sourceInformation: BigJunctionBackupSnapshot;
  private readonly _dataModel: any; // temporarily set to "any" as at the given time, we don't have an accurate type
  private _options: BigJunctionRestorerOptions;

  constructor(
    destinationBigJunction: BigJunctionDataModel,
    sourceBackup: BigJunctionBackupSnapshot,
    dataModel: any = destinationBigJunction.model,
    options: BigJunctionRestorerOptions = {},
  ) {
    this._destinationBigJunction = destinationBigJunction;
    this._sourceInformation = sourceBackup;
    this._dataModel = dataModel ?? destinationBigJunction.model;

    this._options = Object.assign(DEFAULT_RESTORER_OPTIONS, options);
  }

  @Memoize()
  private _canEditBigJunction() {
    return (
      this._destinationBigJunction.isAllowed(
        this._destinationBigJunction.permissionFlags.EDIT_PROPERTIES,
      ) && this._destinationBigJunction.canEditTurns()
    );
  }

  @Memoize()
  private _canEditTurnGuidance(): boolean {
    const turns = this._destinationBigJunction.getShortestTurns(
      this._dataModel,
    );
    const user = getWazeMapEditorWindow().W.loginManager.user;
    return turns.every((turn) =>
      canUserEditTurnGuidanceForTurn(this._dataModel, user, turn),
    );
  }

  @Memoize()
  private _hasTurnsWithGuidance(): boolean {
    return this._sourceInformation.turns.some((turn) =>
      turn.turnData.hasTurnGuidance(),
    );
  }

  @Memoize()
  private _isBigJunctionSignatureMatch() {
    return BigJunctionSignature.fromBigJunction(
      this._destinationBigJunction,
    ).compareTo(this._sourceInformation.signature);
  }

  canRestore(): boolean {
    if (
      !this._options.allowMismatchSignatureRestoration &&
      !this._isBigJunctionSignatureMatch()
    ) {
      return false;
    }

    if (!this._canEditBigJunction()) return false;
    if (this._hasTurnsWithGuidance() && !this._canEditTurnGuidance()) {
      return false;
    }

    return true;
  }

  restore() {
    if (!this.canRestore()) {
      Logger.warn(
        'BigJunctionRestorer restore has been called, while restoration is prohibited, ' +
          'probably due to a missed validation before call',
      );
      return;
    }

    const updateBigJunctionAction = new UpdateBigJunctionAction(
      this._dataModel,
      this._destinationBigJunction,
      {
        turns: this._sourceInformation.turns,
        name: this._sourceInformation.name,
        cityName: this._sourceInformation.address.city,
        stateName: this._sourceInformation.address.state,
        countryName: this._sourceInformation.address.country,
      },
    );
    getWazeMapEditorWindow().W.model.actionManager.add(updateBigJunctionAction);
  }

  [Symbol.dispose](): void {
    this._sourceInformation[Symbol.dispose]();
  }
}
