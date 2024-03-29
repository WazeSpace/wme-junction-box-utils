import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { StreetDataModel } from '@/@waze/Waze/DataModels/StreetDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';
import { getFromSegmentByTurn, getToSegmentByTurn } from './get-segment';

// TODO: Once a type is defined for dataModel parameters - replace with it the types in this file
// Keywords for later search: data model datamodel datamodeltype

export function getStreetBySegment(
  dataModel: any,
  segment: SegmentDataModel,
): StreetDataModel {
  const streetId = segment.getAttribute('primaryStreetID');
  return dataModel.streets.getObjectById(streetId);
}

export function getToStreetByTurn(dataModel: any, turn: Turn): StreetDataModel {
  const segment = getToSegmentByTurn(dataModel, turn);
  return getStreetBySegment(dataModel, segment);
}

export function getFromStreetByTurn(
  dataModel: any,
  turn: Turn,
): StreetDataModel {
  const segment = getFromSegmentByTurn(dataModel, turn);
  return getStreetBySegment(dataModel, segment);
}
