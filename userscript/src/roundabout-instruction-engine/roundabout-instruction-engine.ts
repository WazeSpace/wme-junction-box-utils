import { AddBigJunctionAction, MultiAction } from '@/@waze/Waze/actions';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { JunctionDataModel } from '@/@waze/Waze/DataModels/JunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { TurnNodes } from '@/@waze/Waze/Model/turn';
import { RoundaboutTurnInstructionOpcode } from '@/@waze/Waze/Model/turn-instruction-opcode.enum';
import { Vertex } from '@/@waze/Waze/Vertex';
import { BulkSetTurnOpcodeActions } from '@/actions/bulk-set-turn-opcode.actions';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { extractRoundaboutPerimeterPolygon } from '@/utils/perimeter-geometry-extraction';
import { getRoundaboutByNode } from '@/utils/wme-entities/roundabout';
import { getRoundaboutExitsFrom } from '@/utils/wme-entities/roundabout/get-roundabout-exits';
import { getBigJunctionFromSegmentAndDirection } from '@/utils/wme-entities/segment-big-junction';
import { createAddBigJunctionAction } from '@/utils/wme-feature-creation';
import transformScale from '@turf/transform-scale';
import { RoundaboutInstructionMethod } from './methods/roundabout-instruction-method-application';
import normalizationMethod from './methods/normalization-method';
import deNormalizationMethod from './methods/denormalization-method';
import {
  getJunctionNodeFromSegmentDirection,
  isSegmentConnectsToRoundabout,
  isSegmentDirectionAllowed,
} from '@/utils/wme-entities/segment';
import { createVertexFromSegment } from '@/utils/wme-entities/segment-vertex';
import { UnresolvableRoundaboutTurns } from './errors';

const DEFAULT_INSTRUCTION_METHODS: ReadonlyArray<RoundaboutInstructionMethod> =
  [normalizationMethod, deNormalizationMethod];

export class RoundaboutInstructionEngine {
  private _bigJunction: BigJunctionDataModel;
  private _roundaboutJunction: JunctionDataModel;
  private _fromVertex: Vertex;
  private _dataModel: any;
  private _availableInstructionMethods: ReadonlyArray<RoundaboutInstructionMethod> =
    [...DEFAULT_INSTRUCTION_METHODS];
  private _instructionMethodTurnsMap = new Map<
    string,
    (TurnNodes & { opcode: RoundaboutTurnInstructionOpcode })[]
  >();

  constructor(
    dataModel: any,
    fromSegment: SegmentDataModel,
    fromSegmentDirection: 'forward' | 'reverse',
  ) {
    this._dataModel = dataModel;
    this._fromVertex = createVertexFromSegment(
      fromSegment,
      fromSegmentDirection,
    );
    this._roundaboutJunction = getRoundaboutByNode(
      getJunctionNodeFromSegmentDirection(fromSegment, fromSegmentDirection),
    );
    this._bigJunction = getBigJunctionFromSegmentAndDirection(
      fromSegment,
      fromSegmentDirection,
    );
  }

  //#region From Segment Utility Methods
  private _getFromSegment(): SegmentDataModel {
    const segmentId = this._fromVertex.getSegmentID();
    return this._dataModel.segments.getObjectById(segmentId);
  }

  private _getFromSegmentDirection(): 'forward' | 'reverse' {
    switch (this._fromVertex.direction) {
      case 'fwd':
        return 'forward';
      case 'rev':
        return 'reverse';
      default:
        throw new Error('Unsupported direction');
    }
  }

  private _isDrivingAllowed(): boolean {
    return isSegmentDirectionAllowed(
      this._getFromSegment(),
      this._getFromSegmentDirection(),
    );
  }

  private _isConnectedToRoundabout(): boolean {
    return isSegmentConnectsToRoundabout(
      this._getFromSegment(),
      this._getFromSegmentDirection(),
    );
  }
  //#endregion

  getAvailableInstructionMethods(): ReadonlyArray<RoundaboutInstructionMethod> {
    return this._availableInstructionMethods;
  }
  getPopulatedInstructionMethods(): ReadonlyArray<RoundaboutInstructionMethod> {
    return Array.from(this._instructionMethodTurnsMap.keys(), (rimType) =>
      this._availableInstructionMethods.find((rim) => rim.type === rimType),
    );
  }

  //#region Calculation Methods
  getAvailableTurnNodes(): TurnNodes[] {
    if (!this._isDrivingAllowed()) {
      throw new UnresolvableRoundaboutTurns(
        this._fromVertex,
        this._dataModel,
        'Driving direction restricted',
      );
    }

    if (!this._isConnectedToRoundabout()) {
      throw new UnresolvableRoundaboutTurns(
        this._fromVertex,
        this._dataModel,
        'Not connected to a roundabout',
      );
    }

    return getRoundaboutExitsFrom(this._fromVertex, this._dataModel);
  }

  calcTurnsForAvailableInstructionMethods(): void {
    const turnNodes = this.getAvailableTurnNodes();
    this.getAvailableInstructionMethods().forEach((method) => {
      this._instructionMethodTurnsMap.set(
        method.type,
        method.application(turnNodes),
      );
    });
  }
  //#endregion

  private _hasBigJunction() {
    const segment = this._getFromSegment();
    switch (this._getFromSegmentDirection()) {
      case 'forward':
        return segment.getAttribute('toCrossroads').length > 0;
      case 'reverse':
        return segment.getAttribute('fromCrossroads').length > 0;
      default:
        return false;
    }
  }
  private _createAddBigJunctionIfNotExistAction(): AddBigJunctionAction {
    if (this._hasBigJunction()) return null;

    const perimeter = transformScale(
      extractRoundaboutPerimeterPolygon(this._roundaboutJunction),
      1.2,
    );
    const addBigJunctionAction = createAddBigJunctionAction(perimeter);
    addBigJunctionAction.__jbuSkipAutoRoundaboutize = true;
    return addBigJunctionAction;
  }

  applyInstructionMethod(instructionMethod: RoundaboutInstructionMethod): void {
    const addBigJunctionAction = this._createAddBigJunctionIfNotExistAction();

    const turnNodesAndOpcodes = this._instructionMethodTurnsMap.get(
      instructionMethod.type,
    );
    const applyTIOsAction = new BulkSetTurnOpcodeActions(turnNodesAndOpcodes);

    if (addBigJunctionAction) {
      const multiActionWrapper = new MultiAction([
        addBigJunctionAction,
        applyTIOsAction,
      ]);
      multiActionWrapper.generateDescription = function () {
        this._description = applyTIOsAction.generateDescription();
      };

      getWazeMapEditorWindow().W.model.actionManager.add(multiActionWrapper);
      return;
    }
    getWazeMapEditorWindow().W.model.actionManager.add(applyTIOsAction);
  }
}