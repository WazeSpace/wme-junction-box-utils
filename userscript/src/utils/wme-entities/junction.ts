import { JunctionDataModel } from '@/@waze/Waze/DataModels/JunctionDataModel';
import { JunctionNodeDataModel } from '@/@waze/Waze/DataModels/JunctionNodeDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { distinctArray } from '@/utils/array-utils';
import { getAllJunctionNodesForSegment } from '@/utils/wme-entities/segment';

export function getAllJunctionSegments(
  junction: JunctionDataModel,
): SegmentDataModel[] {
  const segmentRepository = junction.model.getRepository('segment');
  return segmentRepository.getByIds(junction.getSegmentIds());
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
