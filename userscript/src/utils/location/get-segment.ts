import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';
import { Vertex } from '@/@waze/Waze/Vertex';

export function getSegmentByVertex(
  dataModel: any,
  vertex: Vertex,
): SegmentDataModel {
  const segmentId = vertex.getSegmentID();
  return dataModel.segments.getObjectById(segmentId);
}

export function getToSegmentByTurn(
  dataModel: any,
  turn: Turn,
): SegmentDataModel {
  return getSegmentByVertex(dataModel, turn.getToVertex());
}

export function getFromSegmentByTurn(
  dataModel: any,
  turn: Turn,
): SegmentDataModel {
  return getSegmentByVertex(dataModel, turn.getFromVertex());
}
