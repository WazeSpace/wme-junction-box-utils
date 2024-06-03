import { AddBigJunctionAction, MultiAction } from '@/@waze/Waze/actions';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { JunctionDataModel } from '@/@waze/Waze/DataModels/JunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { TurnNodes } from '@/@waze/Waze/Model/turn';
import { InstructionEngine } from './instruction-engine';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { extractRoundaboutPerimeterPolygon } from '@/utils/perimeter-geometry-extraction';
import { getRoundaboutByNode } from '@/utils/wme-entities/roundabout';
import { getRoundaboutExitsFrom } from '@/utils/wme-entities/roundabout/get-roundabout-exits';
import { getBigJunctionFromSegmentAndDirection } from '@/utils/wme-entities/segment-big-junction';
import { createAddBigJunctionAction } from '@/utils/wme-feature-creation';
import { Polygon } from '@turf/helpers';
import transformScale from '@turf/transform-scale';
import { TurnInstructionMethod } from './methods/turn-instruction-method';
import normalizationMethod from './methods/normalization-method';
import deNormalizationMethod from './methods/denormalization-method';
import {
  getJunctionNodeFromSegmentDirection,
  isSegmentConnectsToRoundabout,
} from '@/utils/wme-entities/segment';
import { UnresolvableRoundaboutTurns } from './errors';

const DEFAULT_INSTRUCTION_METHODS: ReadonlyArray<TurnInstructionMethod> = [
  normalizationMethod,
  deNormalizationMethod,
];

export class RoundaboutInstructionEngine extends InstructionEngine {
  private _bigJunction: BigJunctionDataModel;
  private _roundaboutJunction: JunctionDataModel;

  constructor(
    dataModel: any,
    fromSegment: SegmentDataModel,
    fromSegmentDirection: 'forward' | 'reverse',
    additionalInstructionMethods: ReadonlyArray<TurnInstructionMethod> = [],
  ) {
    super(dataModel, fromSegment, fromSegmentDirection, [
      ...DEFAULT_INSTRUCTION_METHODS,
      ...additionalInstructionMethods,
    ]);
    this._roundaboutJunction = getRoundaboutByNode(
      getJunctionNodeFromSegmentDirection(fromSegment, fromSegmentDirection),
    );
    this._bigJunction = getBigJunctionFromSegmentAndDirection(
      fromSegment,
      fromSegmentDirection,
    );
  }

  private _isConnectedToRoundabout(): boolean {
    return isSegmentConnectsToRoundabout(
      this._getFromSegment(),
      this._getFromSegmentDirection(),
    );
  }
  //#endregion

  //#region Calculation Methods
  getAvailableTurns(): TurnNodes[] {
    if (!this._isDrivingAllowed()) {
      throw new UnresolvableRoundaboutTurns(
        this._getFromVertex(),
        this._getDataModel(),
        'Driving direction restricted',
      );
    }

    if (!this._isConnectedToRoundabout()) {
      throw new UnresolvableRoundaboutTurns(
        this._getFromVertex(),
        this._getDataModel(),
        'Not connected to a roundabout',
      );
    }

    return getRoundaboutExitsFrom(this._getFromVertex(), this._getDataModel());
  }
  //#endregion

  private _getGeometryForBigJunction(): Polygon {
    return transformScale(
      extractRoundaboutPerimeterPolygon(this._roundaboutJunction),
      1.2,
    );
  }

  private _getAddBigJunctionAction(): AddBigJunctionAction {
    const bigJunctionGeometry = this._getGeometryForBigJunction();
    const addBigJunctionAction =
      createAddBigJunctionAction(bigJunctionGeometry);
    addBigJunctionAction.__jbuSkipAutoRoundaboutize = true;
    return addBigJunctionAction;
  }

  private _createAddBigJunctionIfNotExistAction(): AddBigJunctionAction {
    if (this._hasBigJunction()) return null;
    return this._getAddBigJunctionAction();
  }

  applyInstructionMethod(instructionMethod: TurnInstructionMethod): void {
    const addBigJunctionAction = this._createAddBigJunctionIfNotExistAction();

    const setTurnInstructionAction =
      this.getSetMethodInstructionsAction(instructionMethod);

    if (addBigJunctionAction) {
      const multiActionWrapper = new MultiAction([
        addBigJunctionAction,
        setTurnInstructionAction,
      ]);
      multiActionWrapper.generateDescription = function (dataModel: any) {
        this._description =
          setTurnInstructionAction.generateDescription(dataModel);
      };

      getWazeMapEditorWindow().W.model.actionManager.add(multiActionWrapper);
      return;
    }
    getWazeMapEditorWindow().W.model.actionManager.add(
      setTurnInstructionAction,
    );
  }
}
