import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { getBigJunctionFromSegmentAndDirection } from '@/utils/wme-entities/segment-big-junction';
import { createVertexFromSegment } from '@/utils/wme-entities/segment-vertex';

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
