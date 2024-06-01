import { TurnInstructionOpcode } from '@/@waze/Waze/Model/turn-instruction-opcode.enum';
import { TurnState } from '@/@waze/Waze/Model/turn-state.enum';

export class TurnData {
  constructor(
    state: number,
    restrictions?: any[],
    instructionOpcode?: TurnInstructionOpcode,
    segmentPath?: number[],
    lanes?: any,
    turnGuidance?: any,
    junctionId?: number,
    pathId?: number,
  );

  instructionOpcode: TurnInstructionOpcode;
  junctionID: number | null;
  lanes: unknown;
  pathID: number | null;
  restrictions: unknown[];
  segmentPath: number[];
  state: TurnState;
  turnGuidance: unknown | null;

  getRestrictions(): unknown[];
  getInstructionOpcode(): TurnInstructionOpcode | null;
  getTurnGuidance(): unknown | null;
  hasTurnGuidance(): boolean;
  hasRestrictions(): boolean;
  getLaneData(): unknown | null;
  hasLanes(): boolean;
  hasInstructionOpcode(): boolean;
  isDifficult(): boolean;
  isDifficult24Seven(): boolean;
  isNot24Seven(): boolean;
  isDifficultTimeRestricted(): boolean;
  isNonDifficultTimeRestricted(): boolean;
  countNonDifficultTimeRestrictions(): number;
  with24SevenDifficulty(isDifficult24Seven: boolean): TurnData;
  withoutDifficultRestrictions(): TurnData;
  withState(state: TurnState): TurnData;
  withRestrictions(restrictions: unknown[]): TurnData;
  withSegmentPath(segmentPath: number[]): TurnData;
  withInstructionOpcode(
    instructionOpcode: TurnInstructionOpcode | null,
  ): TurnData;
  withTurnGuidance(turnGuidance: unknown | null): TurnData;
  withLanes(lanes: unknown | null): TurnData;
  toString(): string;
  isUnknown(): boolean;
  isAllowed(): boolean;
  isDisallowed(): boolean;
  hasAdditionalData(): boolean;
  withToggledState(isAllowed: boolean): TurnData;
  hasSegmentPath(): boolean;
  getSegmentPath(): number[];
  getSegmentPathLength(): number;
  isPathTurn(): boolean;
  getPathID(): number | null;
  setPathID(pathID: number): void;
  withPathID(pathID: number): TurnData;
  withJunctionId(junctionID: number): TurnData;
  isJunctionBoxTurn(): boolean;
}
