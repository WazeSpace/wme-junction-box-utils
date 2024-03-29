import { CityDataModel } from '@/@waze/Waze/DataModels/CityDataModel';
import { CountryDataModel } from '@/@waze/Waze/DataModels/CountryDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { StreetDataModel } from '@/@waze/Waze/DataModels/StreetDataModel';
import { getCityBySegment, getCityByStreet } from './get-city';

// TODO: Once a type is defined for dataModel parameters - replace with it the types in this file
// Keywords for later search: data model datamodel datamodeltype

export function getCountryByCity(
  dataModel: any,
  city: CityDataModel,
): CountryDataModel {
  const countryId = city.getCountryID();
  return dataModel.countries.getObjectById(countryId);
}

export function getCountryByStreet(
  dataModel: any,
  street: StreetDataModel,
): CountryDataModel {
  const city = getCityByStreet(dataModel, street);
  return getCountryByCity(dataModel, city);
}

export function getCountryBySegment(
  dataModel: any,
  segment: SegmentDataModel,
): CountryDataModel {
  const city = getCityBySegment(dataModel, segment);
  return getCountryByCity(dataModel, city);
}
