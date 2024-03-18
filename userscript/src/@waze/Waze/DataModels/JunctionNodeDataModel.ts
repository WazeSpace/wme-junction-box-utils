import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { GeoJsonGeometry } from '@/@waze/Waze/interfaces';

export interface JunctionNodeDataModelAttributes extends DataModelAttributes {
  geoJSONGeometry: GeoJsonGeometry;
  geometry: unknown;
  partial: boolean;
  permissions: number;
  rank: number | null;
  segIDs: number[];
  suggestionTransactionIds: number[];
}

export interface JunctionNodeDataModel
  extends DataModel<JunctionNodeDataModelAttributes> {
  areConnectionsEditable(): boolean;
  allConnectionKeys(): unknown;
  areAllConnectionsDisabled(): boolean;
  areAllConnectionsEnabled(): boolean;
  arePropertiesEditable(): boolean;
  arePropertiesSuggestible(): boolean;
  connectionsExists(): boolean;
  getAngleToSegment(segment: SegmentDataModel): number;
  getDirectionBetweenSegments(
    segmentA: SegmentDataModel,
    segmentB: SegmentDataModel,
  ): boolean;
  getSegmentIds(): number[];
  isConnectedToBigJunction(): boolean;
  isConnectedToSegment(segment: SegmentDataModel): boolean;
  isDisconnected(): boolean;
  isPartial(): boolean;
  isVirtual(): boolean;
}
