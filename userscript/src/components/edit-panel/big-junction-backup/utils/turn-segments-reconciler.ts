import { Turn } from '@/@waze/Waze/Model/turn';
import { TurnData } from '@/@waze/Waze/Model/turn-data';
import { Vertex } from '@/@waze/Waze/Vertex';
import { ChangedIdMapping, reconcileChangedIds } from '@/utils';
import { createVertex } from '@/utils/wme-entities/segment-vertex';

/**
 * Reconcile a vertex to use new segment ids for turns
 * @param vertex Original vertex
 * @param changedIds A list of id changes
 * @param target Either "first" or "last" ("first" is used for toVertex, while "last" is used for fromVertex)
 * @returns New reconciled vertex that can be used as the from/to vertex in turns
 */
function reconcileVertex(
  vertex: Vertex,
  changedIds: ChangedIdMapping[],
  target: 'first' | 'last',
): Vertex {
  const segmentId = vertex.getSegmentID();
  const relevantChange = changedIds.find((change) =>
    change.oldIds.includes(segmentId),
  );
  if (!relevantChange) return vertex;
  const relevantIndex = target === 'first' ? 0 : -1;
  const relevantSegmentId = relevantChange.newIds.at(relevantIndex);
  return createVertex(
    relevantSegmentId,
    vertex.direction === 'fwd' ? 'forward' : 'reverse',
  );
}

/**
 * Reconcile a given turn object with new segment changes (including from/to vertices, and the segment path)
 * @param turn Turn object to reconcile
 * @param changedIds A list of id changes
 * @returns Reconciled turn object with reconciled segments
 */
export function reconcileTurnSegments(
  turn: Turn,
  changedIds: ChangedIdMapping[],
): Turn {
  const reconciledFromVertex = reconcileVertex(
    turn.fromVertex,
    changedIds,
    'last',
  );
  const reconciledToVertex = reconcileVertex(
    turn.toVertex,
    changedIds,
    'first',
  );

  const originalSegmentPath = turn.getTurnData().getSegmentPath();
  const reconciledSegmentPath = reconcileChangedIds(
    originalSegmentPath,
    changedIds,
  );

  const updatedTurnData = turn
    .getTurnData()
    .withSegmentPath(reconciledSegmentPath);

  const TurnClass: {
    new (fromVertex: Vertex, toVertex: Vertex, turnData: TurnData): Turn;
  } = Object.getPrototypeOf(turn).constructor;

  return new TurnClass(
    reconciledFromVertex,
    reconciledToVertex,
    updatedTurnData,
  );
}
