import { CityDataModel } from '@/@waze/Waze/DataModels/CityDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { StreetDataModel } from '@/@waze/Waze/DataModels/StreetDataModel';
import { getStreetBySegment } from './get-street';

// TODO: Once a type is defined for dataModel parameters - replace with it the types in this file
// Keywords for later search: data model datamodel datamodeltype

export function getCityByStreet(
  dataModel: any,
  street: StreetDataModel,
): CityDataModel {
  const cityId = street.getAttribute('cityID');
  return dataModel.cities.getObjectById(cityId);
}

export function getCityBySegment(
  dataModel: any,
  segment: SegmentDataModel,
): CityDataModel {
  const street = getStreetBySegment(dataModel, segment);
  return getCityByStreet(dataModel, street);
}
