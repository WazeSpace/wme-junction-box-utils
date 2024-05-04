import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { Logger } from '@/logger';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { Memoize } from 'typescript-memoize';
import { BigJunctionBackupSnapshot } from './backup-snapshot';
import { canUserEditTurnGuidanceForTurn } from '@/utils/wme-entities/turn';
import { BigJunctionSignature } from '@/types/big-junction-signature';
import { RestoreBigJunctionSnapshotAction } from './restore-big-junction-snapshot.action';

interface BigJunctionRestorerOptions {
  allowMismatchSignatureRestoration?: boolean;
}

const DEFAULT_RESTORER_OPTIONS: BigJunctionRestorerOptions = {
  allowMismatchSignatureRestoration: false,
};

export class BigJunctionRestorer implements Disposable {
  private readonly _destinationBigJunction: BigJunctionDataModel;
  private readonly _sourceInformation: BigJunctionBackupSnapshot;
  private readonly _bigJunctionSignature: BigJunctionSignature;
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
    this._bigJunctionSignature =
      sourceBackup.signature.upgradeSignatureSegmentsLineage();
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
    ).compareTo(this._bigJunctionSignature);
  }

  getRestorationUnavailableReason(): string {
    if (
      !this._options.allowMismatchSignatureRestoration &&
      !this._isBigJunctionSignatureMatch()
    ) {
      return 'SIGNATURE_MISMATCH';
    }

    if (!this._canEditBigJunction()) return 'BIG_JUNCTION_EDITING_DISALLOWED';
    if (this._hasTurnsWithGuidance() && !this._canEditTurnGuidance()) {
      return 'TURN_GUIDANCE_EDITING_DISALLOWED';
    }

    return null;
  }

  restore() {
    if (this.getRestorationUnavailableReason()) {
      Logger.warn(
        'BigJunctionRestorer restore has been called, while restoration is prohibited, ' +
          'probably due to a missed validation before call',
      );
      return;
    }

    getWazeMapEditorWindow().W.model.actionManager.add(
      new RestoreBigJunctionSnapshotAction(
        this._dataModel,
        this._destinationBigJunction,
        this._sourceInformation,
      ),
    );
  }

  [Symbol.dispose](): void {
    this._sourceInformation[Symbol.dispose]();
  }
}
