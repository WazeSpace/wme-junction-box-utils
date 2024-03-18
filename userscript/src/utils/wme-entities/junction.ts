import { JunctionDataModel } from '@/@waze/Waze/DataModels/JunctionDataModel';
import { JunctionNodeDataModel } from '@/@waze/Waze/DataModels/JunctionNodeDataModel';
import { distinctArray } from '@/utils/array-utils';
import { getAllJunctionNodesForSegment } from '@/utils/wme-entities/segment';

export function getAllJunctionNodes(
  roundaboutJunction: JunctionDataModel,
): JunctionNodeDataModel[] {
  const segments = roundaboutJunction.getAllSegments();
  const nodesFromSegmentsNotDistinct = segments.flatMap((segment) =>
    getAllJunctionNodesForSegment(segment),
  );
  return distinctArray(nodesFromSegmentsNotDistinct, (node) =>
    node.getAttribute('id'),
  );
}
