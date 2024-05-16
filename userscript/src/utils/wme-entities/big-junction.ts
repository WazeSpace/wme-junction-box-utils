import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';
import { uniqBy } from '../uniq-by';
import { Vertex } from '@/@waze/Waze/Vertex';
import { getSegmentByVertex } from '../location';

function getTurnSegmentsByBigJunction(
  bigJunction: BigJunctionDataModel,
  turnToSegmentIdMapper: (turn: Turn) => number,
): SegmentDataModel[] {
  const turns = bigJunction.getShortestTurns(bigJunction.model);
  const uniqueTurns = uniqBy(turns, turnToSegmentIdMapper);
  const segmentIds = uniqueTurns.map(turnToSegmentIdMapper);
  const segments: SegmentDataModel[] =
    bigJunction.model.segments.getByIds(segmentIds);
  if (segments.length < segmentIds.length) {
    throw new Error("One or more turn segments don't exist");
  }

  return segments;
}

export function getEntranceSegmentsByBigJunction(
  bigJunction: BigJunctionDataModel,
): SegmentDataModel[] {
  return getTurnSegmentsByBigJunction(bigJunction, (turn) =>
    turn.getFromVertex().getSegmentID(),
  );
}

export function getExitSegmentsByBigJunction(
  bigJunction: BigJunctionDataModel,
): SegmentDataModel[] {
  return getTurnSegmentsByBigJunction(bigJunction, (turn) =>
    turn.getToVertex().getSegmentID(),
  );
}

export function isBigJunctionOnRoundabout(bigJunction: BigJunctionDataModel) {
  const segments = bigJunction.getShortSegments(bigJunction);
  // check if we have segments, because it is possible to have a big junction with no segments at all
  if (!segments.length) return false;

  // use "some" iterator over "every" iterator for performance reasons
  // (if a single segment is not in roundabout, then we don't have to check the rest)
  return !segments.some((segment) => !segment.isInRoundabout());
}

export function isVertexConnectsToBigJunction(
  dataModel: any,
  vertex: Vertex,
  bigJunction?: BigJunctionDataModel,
): boolean {
  const segment = getSegmentByVertex(dataModel, vertex);
  const crossroads = segment.getAttribute(
    vertex.direction === 'fwd' ? 'toCrossroads' : 'fromCrossroads',
  );
  if (!bigJunction) return crossroads.length > 0;
  return crossroads.includes(bigJunction.getAttribute('id'));
}
