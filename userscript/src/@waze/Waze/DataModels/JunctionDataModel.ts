import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';

export interface JunctionDataModelAttributes extends DataModelAttributes {
  segIDs: number[];
  valid: boolean;
}

export interface JunctionDataModel
  extends DataModel<JunctionDataModelAttributes> {
  getSegmentsIds(): number[];
}
