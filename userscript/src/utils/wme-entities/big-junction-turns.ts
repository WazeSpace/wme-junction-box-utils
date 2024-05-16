import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { getBigJunctionFromSegmentAndDirection } from '@/utils/wme-entities/segment-big-junction';
import { createVertexFromSegment } from '@/utils/wme-entities/segment-vertex';
import {
  getEntranceSegmentsByBigJunction,
  isVertexConnectsToBigJunction,
} from './big-junction';
import { Vertex } from '@/@waze/Waze/Vertex';

export function getAllTurnsOfBigJunctionFromSegment(
  segment: SegmentDataModel,
  direction: 'forward' | 'reverse',
  bigJunction: BigJunctionDataModel = getBigJunctionFromSegmentAndDirection(
    segment,
    direction,
  ),
) {
  if (!bigJunction) return null;

  const segmentVertex = createVertexFromSegment(segment, direction);
  return bigJunction.getTurnsFrom(segmentVertex);
}

export function getBigJunctionTurns(bigJunction: BigJunctionDataModel) {
  const bigJunctionId = bigJunction.getAttribute('id');
  const entranceSegments = getEntranceSegmentsByBigJunction(bigJunction);
  return entranceSegments.flatMap((segment) => {
    const toCrossroads = segment.getAttribute('toCrossroads');
    const isFwdEntersBigJunction = toCrossroads.includes(bigJunctionId);
    const entranceDirection = isFwdEntersBigJunction ? 'forward' : 'reverse';
    const entranceVertex = createVertexFromSegment(segment, entranceDirection);
    return bigJunction.getTurnsFrom(bigJunction.model, entranceVertex);
  });
}

export function hasBigJunctionTurn(
  bigJunction: BigJunctionDataModel,
  fromVertex: Vertex,
  toVertex: Vertex,
): boolean {
  const dataModel = bigJunction.model;

  if (!isVertexConnectsToBigJunction(dataModel, fromVertex, bigJunction))
    return false;

  return dataModel.getTurnGraph().hasTurn(fromVertex, toVertex);
}
