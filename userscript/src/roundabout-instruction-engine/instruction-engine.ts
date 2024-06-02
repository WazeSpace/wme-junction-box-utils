import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { TurnNodes } from '@/@waze/Waze/Model/turn';
import { Vertex } from '@/@waze/Waze/Vertex';
import { SetTurnsByInstructionMethodAction } from '@/roundabout-instruction-engine/actions';
import { TurnInstructionMethod } from '@/roundabout-instruction-engine/methods/turn-instruction-method';
import { isSegmentDirectionAllowed } from '@/utils/wme-entities/segment';
import { createVertexFromSegment } from '@/utils/wme-entities/segment-vertex';

export class InstructionEngine {
  private readonly _fromVertex: Vertex;
  private readonly _dataModel: any;
  private readonly _availableInstructionMethods: ReadonlyArray<TurnInstructionMethod>;

  protected constructor(
    dataModel: any,
    fromSegment: SegmentDataModel,
    fromSegmentDirection: 'forward' | 'reverse',
    instructionMethods: ReadonlyArray<TurnInstructionMethod>,
  ) {
    this._dataModel = dataModel;
    this._fromVertex = createVertexFromSegment(
      fromSegment,
      fromSegmentDirection,
    );
    this._availableInstructionMethods = instructionMethods;
  }

  protected _getDataModel() {
    return this._dataModel;
  }

  //#region From Segment Utility Methods
  protected _getFromVertex(): Vertex {
    return this._fromVertex;
  }

  protected _getFromSegment(): SegmentDataModel {
    const segmentId = this._getFromVertex().getSegmentID();
    return this._dataModel.segments.getObjectById(segmentId);
  }

  protected _getFromSegmentDirection(): 'forward' | 'reverse' {
    switch (this._fromVertex.direction) {
      case 'fwd':
        return 'forward';
      case 'rev':
        return 'reverse';
      default:
        throw new Error('Unsupported direction');
    }
  }

  protected _isDrivingAllowed(): boolean {
    return isSegmentDirectionAllowed(
      this._getFromSegment(),
      this._getFromSegmentDirection(),
    );
  }
  //#endregion

  // protected abstract _getGeometryForBigJunction(): Polygon;
  private _getBigJunctionId(): number | null {
    const segment = this._getFromSegment();
    switch (this._getFromSegmentDirection()) {
      case 'forward':
        return segment.getAttribute('toCrossroads')[0] || null;
      case 'reverse':
        return segment.getAttribute('fromCrossroads')[0] || null;
      default:
        return null;
    }
  }
  private _getBigJunction(): BigJunctionDataModel {
    const bigJunctionId = this._getBigJunctionId();
    if (!bigJunctionId) return null;
    return this._dataModel.bigJunctions.getObjectById(bigJunctionId);
  }
  protected _hasBigJunction(): boolean {
    return this._getBigJunctionId() !== null;
  }

  getAvailableInstructionMethods(): ReadonlyArray<TurnInstructionMethod> {
    return this._availableInstructionMethods;
  }

  getAvailableTurns(): TurnNodes[] {
    return this._getBigJunction().getTurnsFrom(
      this._dataModel,
      this._fromVertex,
    );
  }

  getSetMethodInstructionsAction(
    method: TurnInstructionMethod,
  ): SetTurnsByInstructionMethodAction {
    return new SetTurnsByInstructionMethodAction(
      method,
      this.getAvailableTurns(),
    );
  }
}
