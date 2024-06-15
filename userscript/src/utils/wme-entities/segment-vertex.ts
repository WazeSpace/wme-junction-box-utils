import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Vertex } from '@/@waze/Waze/Vertex';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

function getVertexDirectionFromNormalDirection(
  direction: 'forward' | 'reverse',
) {
  switch (direction) {
    case 'forward':
      return 'fwd';
    case 'reverse':
      return 'rev';
    default:
      throw new Error('Unsupported direction');
  }
}

export function createVertex(
  segmentId: number,
  direction: 'forward' | 'reverse',
): Vertex {
  const Vertex = getWazeMapEditorWindow().require('Waze/Model/Graph/Vertex');
  return new Vertex(
    segmentId,
    getVertexDirectionFromNormalDirection(direction),
  );
}

export function createVertexFromSegment(
  segment: SegmentDataModel,
  direction: 'forward' | 'reverse',
) {
  return createVertex(segment.getAttribute('id'), direction);
}

export function createForwardVertexFromSegment(segment: SegmentDataModel) {
  return createVertexFromSegment(segment, 'forward');
}

export function createReverseVertexFromSegment(segment: SegmentDataModel) {
  return createVertexFromSegment(segment, 'reverse');
}

export function createVertexById(vertexId: string): Vertex {
  const segmentId = parseInt(vertexId.substring(0, vertexId.length - 1));
  const direction =
    vertexId[vertexId.length - 1] === 'f' ? 'forward' : 'reverse';
  return createVertex(segmentId, direction);
}
