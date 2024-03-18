import { TurnData } from '@/@waze/Waze/Model/turn-data';
import { Vertex } from '@/@waze/Waze/Vertex';

export interface Turn {
  readonly fromVertex: Vertex;
  readonly toVertex: Vertex;
  readonly turnData: TurnData;

  getFromVertex(): Vertex;
  getToVertex(): Vertex;
  getTurnData(): TurnData;
  withFromVertex(vertex: Vertex): Turn;
  withToVertex(vertex: Vertex): Turn;
  withTurnData(turnData: TurnData): Turn;
  withUnknownTurnData(): Turn;
  withPathId(pathId: number): Turn;
  isFarTurn(): boolean;
  isUturn(): boolean;
  toString(): string;
  verticesEqual(turn: Turn): boolean;
  getAllSegmentIds(): number[];
  isPathTurn(): boolean;
  getPathID(): number;
  toJSON(): object;
  isJunctionBoxTurn(): boolean;
}
