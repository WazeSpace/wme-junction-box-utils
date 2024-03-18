import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { GeoJsonGeometry } from '@/@waze/Waze/interfaces';
import { Turn } from '@/@waze/Waze/Model/turn';
import { Vertex } from '@/@waze/Waze/Vertex';

export interface BigJunctionDataModelAttributes extends DataModelAttributes {
  segIDs: number[];
  rank: number;
  name: string;
  cityID: number;
  geoJSONGeometry: GeoJsonGeometry;
  geometry: unknown;
}

export interface BigJunctionDataModel
  extends DataModel<BigJunctionDataModelAttributes> {
  getAddress(): unknown;
  getSegmentCount(): number;
  getRank(): number;
  getAllPossibleTurns(): Turn[];
  getPossibleTurnsBetween(fromVertex: Vertex, toVertex: Vertex): Turn[];
  getTurnsFrom(fromVertex: Vertex): Turn[];
  getShortestTurns(): Turn[];
  getShortestNonImmediateTurns(): Turn[];
  getShortSegments(): SegmentDataModel[];
  canEditTurns(): boolean;
}
