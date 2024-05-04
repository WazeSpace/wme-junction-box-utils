import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { RoadType } from '../enums';
import { LineString } from '@turf/helpers';

export interface SegmentDataModelAttributes extends DataModelAttributes {
  roadType: RoadType;
  routingRoadType: RoadType;
  separator: boolean;
  lockRank: number;
  validated: boolean;
  fwdDirection: boolean;
  revDirection: boolean;
  fromNodeID: number;
  toNodeID: number;
  primaryStreetID: number;
  fwdMaxSpeed: number;
  revMaxSpeed: number;
  fwdMaxSpeedUnverified: boolean;
  revMaxSpeedUnverified: boolean;
  streetIDs: number[];
  junctionID: number | null;
  hasHNs: boolean;
  hasClosures: boolean;
  length: number;
  fwdToll: boolean;
  revToll: boolean;
  restrictions: unknown[];
  parkingRestrictions: unknown[];
  pickupRestrictions: unknown[];
  permissions: number;
  crossroadID: number | null;
  fromCrossroads: number[];
  toCrossroads: number[];
  fromLanesInfo: unknown;
  toLanesInfo: unknown;
  flags: number;
  allowNoDirection: boolean;
  fwdTurnsLocked: boolean;
  revTurnsLocked: boolean;
  fwdFlags: number;
  revFlags: number;
  level: number;
  rank: number;
  geoJSONGeometry: LineString;
  pathIds: number[];
  suggestionPermissions: number;
  geometry: unknown;
  fwdLaneCount: number;
  revLaneCount: number;
  suggestionTransactionIds: number[];
  virtualNodeIDs: number[];
  origIDs?: number[];
}
export interface SegmentDataModel
  extends DataModel<SegmentDataModelAttributes> {
  isLockedByHigherRank(): boolean;
  isWalkingRoadType(): boolean;
  isRoutable(): boolean;
  isInBigJunction(): boolean;
  isBigJunctionShort(): boolean;
  hasFromBigJunction(): boolean;
  hasToBigJunction(): boolean;
  getRoundabout(): boolean;
  isInRoundabout(): boolean;
}
