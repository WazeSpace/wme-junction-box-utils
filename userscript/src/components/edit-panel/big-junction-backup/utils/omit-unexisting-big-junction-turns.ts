import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import {
  SegmentDataModel,
  SegmentDataModelAttributes,
} from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';
import {
  getEntranceSegmentsByBigJunction,
  getExitSegmentsByBigJunction,
} from '@/utils/wme-entities/big-junction';
import { isSegmentDirectionAllowed } from '@/utils/wme-entities/segment';

type SegmentsMap = ReadonlyMap<
  SegmentDataModelAttributes['id'],
  SegmentDataModel
>;

function isTurnExistsInBigJunction(
  turn: Turn,
  entranceSegments: SegmentsMap,
  exitSegments: SegmentsMap,
) {
  const fromSegment = entranceSegments.get(turn.fromVertex.getSegmentID());
  if (
    !fromSegment ||
    !isSegmentDirectionAllowed(
      fromSegment,
      turn.fromVertex.direction === 'fwd' ? 'forward' : 'reverse',
    )
  ) {
    return false;
  }

  const toSegment = exitSegments.get(turn.toVertex.getSegmentID());
  if (
    !toSegment ||
    !isSegmentDirectionAllowed(
      toSegment,
      turn.toVertex.direction === 'fwd' ? 'forward' : 'reverse',
    )
  ) {
    return false;
  }

  return true;
}

function convertSegmentArrayToMap(segments: SegmentDataModel[]): SegmentsMap {
  const map = new Map<SegmentDataModelAttributes['id'], SegmentDataModel>();
  segments.forEach((segment) => map.set(segment.getAttribute('id'), segment));
  return map;
}

export function omitUnexistingBigJunctionTurns(
  bigJunction: BigJunctionDataModel,
  turns: Turn[],
): Turn[] {
  const bigJunctionEntrances = convertSegmentArrayToMap(
    getEntranceSegmentsByBigJunction(bigJunction),
  );
  const bigJunctionExits = convertSegmentArrayToMap(
    getExitSegmentsByBigJunction(bigJunction),
  );

  return turns.filter((turn) =>
    isTurnExistsInBigJunction(turn, bigJunctionEntrances, bigJunctionExits),
  );
}
