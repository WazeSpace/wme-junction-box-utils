import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { MultiPolygon } from '@turf/helpers';

export interface StateDataModelAttributes extends DataModelAttributes {
  countryID: number;
  geometry: MultiPolygon;
  isDefault: boolean;
  name: string;
}

export interface StateDataModel extends DataModel<StateDataModelAttributes> {
  type: 'state';
  getName(): string;
  toJSON(): object;
}
