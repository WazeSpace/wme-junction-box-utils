import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Vertex } from '@/@waze/Waze/Vertex';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

export interface SimpleVertex {
  segmentId: number;
  direction: 'fwd' | 'rev';
}

export function parseVertexId(vertexId: string): SimpleVertex {
  const segmentId = parseInt(vertexId.substring(0, vertexId.length - 1));
  const direction =
    vertexId[vertexId.length - 1] === 'f' ? 'fwd' : 'rev';
  return { segmentId, direction };
}

function getVertexDirectionFromNormalDirection(
  direction: 'forward' | 'reverse',
): 'fwd' | 'rev' {
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
): Vertex {
  return createVertex(segment.getAttribute('id'), direction);
}

export function createForwardVertexFromSegment(segment: SegmentDataModel): Vertex {
  return createVertexFromSegment(segment, 'forward');
}

export function createReverseVertexFromSegment(segment: SegmentDataModel): Vertex {
  return createVertexFromSegment(segment, 'reverse');
}

export function createVertexById(vertexId: string): Vertex {
  const parsed = parseVertexId(vertexId);
  const direction = parsed.direction === 'fwd' ? 'forward' : 'reverse';
  return createVertex(parsed.segmentId, direction);
}
