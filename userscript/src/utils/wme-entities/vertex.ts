import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Vertex } from '@/@waze/Waze/Vertex';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { getSegmentGeometryForDirection } from '@/utils/wme-entities/segment';

export function getSegmentFromVertex(vertex: Vertex): SegmentDataModel {
  const window = getWazeMapEditorWindow();
  const segmentRepository = window.W.model.getRepository('segment');
  return segmentRepository.getObjectById(vertex.getSegmentID());
}

export function getSegmentGeometryFromVertex(vertex: Vertex) {
  const segment = getSegmentFromVertex(vertex);
  const direction = vertex.isForward() ? 'forward' : 'reverse';
  return getSegmentGeometryForDirection(segment, direction);
}
