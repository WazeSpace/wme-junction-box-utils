import { DataModel, DataModelAttributes } from './DataModel';
import { Point } from '@turf/helpers';

export interface CityDataModelAttributes extends DataModelAttributes {
  countryID: number;
  stateID: string;
  englishName: string;
  name: string;
  geoJSONGeometry: Point;
  geometry: unknown;
}

export interface CityDataModel extends DataModel<CityDataModelAttributes> {
  getCityID(): number;
  getStateID(): number;
  getCountryID(): number;
  getEnglishName(): string;
  getName(): string;

  hasName(): boolean;
  hasValidGeometry(): boolean;
  isEmpty(): boolean;
}
