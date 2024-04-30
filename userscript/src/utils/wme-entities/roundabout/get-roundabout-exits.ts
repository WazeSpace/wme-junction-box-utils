import { Vertex } from '@/@waze/Waze/Vertex';
import { getRoundaboutByNode } from '@/utils/wme-entities/roundabout/get-roundabout-by-node';
import {
  createForwardVertexFromSegment,
  createReverseVertexFromSegment,
} from '@/utils/wme-entities/segment-vertex';
import {
  getJunctionNodeFromSegmentDirection,
  getSegmentDestinationNodeInTravelDirection,
  isSegmentDirectionAllowed,
} from '../segment';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { getAllTurnsOfBigJunctionFromSegment } from '../big-junction-turns';
import { getSegmentByVertex } from '@/utils/location';

interface RoundaboutExitPath {
  fromVertex: Vertex;
  toVertex: Vertex;
}

export function getRoundaboutExitsFrom(
  vertex: Vertex,
  dataModel: any,
): RoundaboutExitPath[] {
  const segment = getSegmentByVertex(dataModel, vertex);
  const node = getJunctionNodeFromSegmentDirection(
    segment,
    vertex.direction === 'fwd' ? 'forward' : 'reverse',
  );

  if (node.isConnectedToBigJunction()) {
    return getAllTurnsOfBigJunctionFromSegment(
      getSegmentByVertex(dataModel, vertex),
      vertex.direction === 'fwd' ? 'forward' : 'reverse',
    );
  }

  // retrieve the roundabout junction from the model
  const roundabout = getRoundaboutByNode(node);
  if (!roundabout)
    throw new Error('Roundabout not found at node ' + node.getAttribute('id'));

  // get all inner segments of a roundabout
  const roundaboutSegIDs = roundabout.getSegmentsIds();
  const roundaboutSegments: SegmentDataModel[] =
    roundabout.model.segments.getByIds(roundaboutSegIDs);

  const paths: RoundaboutExitPath[] = [];
  for (const roundaboutSegment of roundaboutSegments) {
    // get the destination node to loop over the segments connected to it
    const node = getSegmentDestinationNodeInTravelDirection(roundaboutSegment);
    const nodeSegIDs = node.getSegmentIds();
    const nodeSegments: SegmentDataModel[] =
      node.model.segments.getByIds(nodeSegIDs);

    for (const segment of nodeSegments) {
      // if the segment is inside the roundabout, then skip to the next one
      if (segment.isInRoundabout()) continue;

      if (isSegmentDirectionAllowed(segment, 'forward')) {
        // if the fromNode differs from the node itself, then we are leaving the node, hence it is a roundabout exit
        const fromNode = getJunctionNodeFromSegmentDirection(
          segment,
          'forward',
        );
        if (fromNode.getAttribute('id') !== node.getAttribute('id')) {
          paths.push({
            fromVertex: vertex,
            toVertex: createForwardVertexFromSegment(segment),
          });
        }
      }

      if (isSegmentDirectionAllowed(segment, 'reverse')) {
        // if the toNode differs from the node itself, then we are leaving the node, hence it is a roundabout exit
        const toNode = getJunctionNodeFromSegmentDirection(segment, 'reverse');
        if (toNode.getAttribute('id') !== node.getAttribute('id')) {
          paths.push({
            fromVertex: vertex,
            toVertex: createReverseVertexFromSegment(segment),
          });
        }
      }
    }
  }

  return paths;
}
