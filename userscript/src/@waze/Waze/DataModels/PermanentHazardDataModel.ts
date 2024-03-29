import { PermanentHazardType } from '../enums';
import { Point } from '@turf/helpers';
import { DataModel, DataModelAttributes } from './DataModel';

export interface PermanentHazardDataModelAttributes
  extends DataModelAttributes {
  direction: 'FWD' | 'REV' | 'BOTH';
  geoJSONGeometry: Point;
  geometry: unknown;
  segmentId: number;
  type: PermanentHazardType;
}

export interface PermanentHazardDataModel
  extends DataModel<PermanentHazardDataModelAttributes> {}
