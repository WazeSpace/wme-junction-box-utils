import { CityDataModel } from './CityDataModel';
import { CountryDataModel } from './CountryDataModel';
import { DataModel, DataModelAttributes } from './DataModel';
import { StateDataModel } from './StateDataModel';
import { StreetDataModel } from './StreetDataModel';

export interface AddressDataModelAttributes extends DataModelAttributes {
  altStreets: StreetDataModel[];
  street: StreetDataModel;
  city: CityDataModel;
  state: StateDataModel;
  country: CountryDataModel;
  houseNumber: number | null;
  isEmpty: boolean;
}

export interface AddressDataModel
  extends DataModel<AddressDataModelAttributes> {
  getAltStreets(): StreetDataModel[];
  getStreet(): StreetDataModel;
  getStreetName(): string;
  isEmptyStreet(): boolean;
  getCity(): CityDataModel;
  getCityName(): string;
  getState(): StateDataModel;
  getStateName(): string;
  hasState(): boolean;
  getCountry(): CountryDataModel;
  getCountryName(): string;
  isEmpty(): boolean;
  format(): string;
}
