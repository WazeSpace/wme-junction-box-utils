import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { JunctionDataModel } from '@/@waze/Waze/DataModels/JunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';
import { RoundaboutTurnInstructionOpcode } from '@/@waze/Waze/Model/turn-instruction-opcode.enum';
import { NormalizeRoundaboutExitsAction } from '@/roundabout-normalization-engine/normalize-roundabout-exits.action';
import { RoundaboutNormalizationForbiddenReason } from '@/roundabout-normalization-engine/roundabout-normalization-forbidden-reason';
import { RoundaboutNormalizationForbiddenError } from '@/roundabout-normalization-engine/roundabout-normalization-forbidden.error';
import { groupTurnsByDesiredInstruction } from '@/roundabout-normalization-engine/utils';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { getAllTurnsOfBigJunctionFromSegment } from '@/utils/wme-entities/big-junction-turns';
import {
  isSegmentConnectsToRoundabout,
  isSegmentDirectionAllowed,
} from '@/utils/wme-entities/segment';
import { getBigJunctionFromSegmentAndDirection } from '@/utils/wme-entities/segment-big-junction';

const MAX_ALLOWED_TURNS_PER_ROUNDABOUT = Infinity;

export class RoundaboutNormalizationEngine {
  private _roundaboutJunction: JunctionDataModel;
  private _fromSegment: SegmentDataModel;
  private _drivingDirection: 'forward' | 'reverse';
  private _bigJunction: BigJunctionDataModel;
  private readonly _createNormalizationForbiddenError: (
    reason: RoundaboutNormalizationForbiddenReason,
  ) => RoundaboutNormalizationForbiddenError;
  private _turnsWithInstructionMap = new Map<
    RoundaboutTurnInstructionOpcode,
    Turn[]
  >();
  private _exitInstructionsBuildError: RoundaboutNormalizationForbiddenError;

  constructor(fromSegment: SegmentDataModel, direction: 'forward' | 'reverse') {
    this._createNormalizationForbiddenError =
      RoundaboutNormalizationForbiddenError.createReasonableFactory(
        fromSegment,
        direction,
        (reason) =>
          reason
            ? `jb_utils.segment.actions.roundabout_norm.fail_reasons.${reason}.description`
            : null,
      );

    this._fromSegment = fromSegment;
    this._drivingDirection = direction;
    this._bigJunction ??= this.getDefaultBigJunction();

    this.buildExitInstructions();
  }

  createBigJunction() {
    /* TODO
    1. Get the React Fiber node for the draw junction box button
    2. Use the RF node to get the OpenLayers control of it
    3. Get the drawCallback from the OpenLayers control
    4. Set up a one-time interceptor on the W.actionManager.add function to...
          ...catch the action of the junction box creation
    5. Use the callback to create a new junction box.
    6. The callback will try to add the action to the actionManager, which will...
          ...be caught by the interceptor
    7. Extract the created junction box, add the action to our dynamic MultiAction...
          ...related to this normalization engine instance.
    8. Perform the original junction box creation action to get it added...
          ...added to the WME and all the underlying infrastructure...
          ...including segments and other entities
     */
  }

  private getDefaultBigJunction(): BigJunctionDataModel {
    if (!this.isSegmentDrivable() || !this.isSegmentConnectsToRoundabout())
      return null;

    return getBigJunctionFromSegmentAndDirection(
      this._fromSegment,
      this._drivingDirection,
    );
  }

  private isSegmentDrivable() {
    return isSegmentDirectionAllowed(this._fromSegment, this._drivingDirection);
  }

  private isSegmentConnectsToRoundabout() {
    return isSegmentConnectsToRoundabout(
      this._fromSegment,
      this._drivingDirection,
    );
  }

  /**
   * Calculates and stores the navigation instructions for all possible exits from the roundabout.
   */
  buildExitInstructions() {
    try {
      const turns = this.getTurnsForNormalization();
      this._turnsWithInstructionMap = groupTurnsByDesiredInstruction(turns);
    } catch (e) {
      if (e instanceof RoundaboutNormalizationForbiddenError)
        this._exitInstructionsBuildError = e;
      else throw e;
    }
  }

  getTurnsForNormalization() {
    if (!this.isSegmentDrivable())
      throw this._createNormalizationForbiddenError(null);
    if (!this.isSegmentConnectsToRoundabout())
      throw this._createNormalizationForbiddenError(null);
    if (!this._bigJunction) {
      throw this._createNormalizationForbiddenError(
        RoundaboutNormalizationForbiddenReason.BigJunctionIsRequired,
      );
    }

    const turns = getAllTurnsOfBigJunctionFromSegment(
      this._fromSegment,
      this._drivingDirection,
      this._bigJunction,
    ).filter((turn) => turn.isFarTurn());

    if (turns.length > MAX_ALLOWED_TURNS_PER_ROUNDABOUT) {
      throw this._createNormalizationForbiddenError(
        RoundaboutNormalizationForbiddenReason.TooManyExits,
      );
    }

    return turns;
  }

  hasExitInstructionBuildError(): boolean {
    return this._exitInstructionsBuildError != null;
  }

  getExitInstructionBuildErrorMessage(): string {
    if (!this._exitInstructionsBuildError.userLanguageExplanationKey)
      return null;

    const i18n = getWazeMapEditorWindow().I18n;
    return i18n.t(this._exitInstructionsBuildError.userLanguageExplanationKey);
  }

  hasSuggestedTurnsWithInstructionsStored(): boolean {
    return this._turnsWithInstructionMap != null;
  }

  isBuilt(): boolean {
    return (
      !this.hasExitInstructionBuildError() &&
      this.hasSuggestedTurnsWithInstructionsStored()
    );
  }

  applySuggestedTurnInstructions() {
    const turnGraph = getWazeMapEditorWindow().W.model.getTurnGraph();
    const normalizationAction = new NormalizeRoundaboutExitsAction(
      turnGraph,
      this._turnsWithInstructionMap,
    );
    getWazeMapEditorWindow().W.model.actionManager.add(normalizationAction);
  }
}
