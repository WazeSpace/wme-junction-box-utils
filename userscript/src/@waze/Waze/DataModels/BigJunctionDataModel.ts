import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';
import { Vertex } from '@/@waze/Waze/Vertex';
import { Polygon } from '@turf/helpers';
import { AddressDataModel } from './AddressDataModel';

export interface BigJunctionDataModelAttributes extends DataModelAttributes {
  segIDs: number[];
  rank: number;
  name: string;
  cityID: number;
  geoJSONGeometry: Polygon;
  geometry: unknown;
}

export interface BigJunctionDataModel
  extends DataModel<BigJunctionDataModelAttributes> {
  getAddress(dataModel: any): AddressDataModel;
  getSegmentCount(): number;
  getRank(): number;
  getAllPossibleTurns(dataModel: any): Turn[];
  getPossibleTurnsBetween(
    dataModel: any,
    fromVertex: Vertex,
    toVertex: Vertex,
  ): Turn[];
  getTurnsFrom(dataModel: any, fromVertex: Vertex): Turn[];
  getShortestTurns(dataModel: any): Turn[];
  getShortestNonImmediateTurns(dataModel: any): Turn[];
  getShortSegments(dataModel: any): SegmentDataModel[];
  canEditTurns(): boolean;
}
