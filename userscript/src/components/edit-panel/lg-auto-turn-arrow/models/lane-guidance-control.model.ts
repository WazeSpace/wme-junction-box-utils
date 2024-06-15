import {
  LaneGuidanceInstructionStrategy,
  LaneGuidanceMode,
} from '@/@waze/Waze/enums';
import { Collection, Model } from 'backbone';

interface LaneGuidanceControlModelTurnAttr {
  fromVertexID: string;
  toVertexID: string;
  streetName: string;
  angle: number | null;
  angleOverride: number | null;
  checkboxes: Array<{
    checked: boolean;
    index: number;
    uniqueId: string;
  }>;
  checkedIndexes: number[];
  isFarTurn: boolean;
  isUTurn: boolean;
  guidanceMode: LaneGuidanceMode;
  instructionStrategy: LaneGuidanceInstructionStrategy | null;
}
interface LaneGuidanceControlModelFarTurnAttr
  extends LaneGuidanceControlModelTurnAttr {
  isFarTurn: true;
  farTurnAngle: number;
}

export type LaneGuidanceControlTurnModel<
  T extends
    | LaneGuidanceControlModelTurnAttr
    | LaneGuidanceControlModelFarTurnAttr =
    | LaneGuidanceControlModelTurnAttr
    | LaneGuidanceControlModelFarTurnAttr,
> = Model<T>;

export type LaneGuidanceControlModel = Model<{
  fromVertexID: string;
  hasChanged: boolean;
  hasCollisions: boolean;
  hasGaps: boolean;
  hasIllegalFarLanes: boolean;
  laneCount: number;
  farTurns: Collection<
    LaneGuidanceControlTurnModel<LaneGuidanceControlModelFarTurnAttr>
  >;
  immediateTurns: Collection<LaneGuidanceControlTurnModel>;
}>;

export function isFarTurnLaneGuidanceControlModel(
  model: LaneGuidanceControlTurnModel,
): model is LaneGuidanceControlTurnModel<LaneGuidanceControlModelFarTurnAttr> {
  return model.get('isFarTurn') === true;
}

export function isLaneGuidanceControlModel(
  model: Model,
): model is LaneGuidanceControlModel {
  return (
    'farTurns' in model.attributes &&
    'immediateTurns' in model.attributes &&
    'laneCount' in model.attributes
  );
}
