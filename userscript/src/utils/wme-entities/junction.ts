import { JunctionDataModel } from '@/@waze/Waze/DataModels/JunctionDataModel';
import { JunctionNodeDataModel } from '@/@waze/Waze/DataModels/JunctionNodeDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { distinctArray } from '@/utils/array-utils';
import { getAllJunctionNodesForSegment } from '@/utils/wme-entities/segment';

export function getAllJunctionSegments(
  junction: JunctionDataModel,
): SegmentDataModel[] {
  const segmentRepository = junction.model.getRepository('segment');
  const allLoadedSegments: SegmentDataModel[] =
    segmentRepository.getObjectArray();
  return allLoadedSegments.filter(
    (segment) =>
      segment.getAttribute('junctionID') === junction.getAttribute('id') &&
      segment.state !== 'DELETE',
  );
}

export function getAllJunctionNodes(
  roundaboutJunction: JunctionDataModel,
): JunctionNodeDataModel[] {
  const segments = getAllJunctionSegments(roundaboutJunction);
  const nodesFromSegmentsNotDistinct = segments.flatMap((segment) =>
    getAllJunctionNodesForSegment(segment),
  );
  return distinctArray(nodesFromSegmentsNotDistinct, (node) =>
    node.getAttribute('id'),
  );
}
