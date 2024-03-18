import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { JunctionNodeDataModel } from '@/@waze/Waze/DataModels/JunctionNodeDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { isJunctionNodePartOfRoundabout } from '@/utils/wme-entities/junction-node';

export function getJunctionNodeFromSegmentDirection(
  segment: SegmentDataModel,
  direction: 'forward' | 'reverse',
): JunctionNodeDataModel {
  const nodeId = segment.getAttribute(
    direction === 'forward' ? 'toNodeID' : 'fromNodeID',
  );
  const nodeRepository = segment.model.getRepository(
    WazeMapEditorEntityType.Node,
  );
  return nodeRepository.getObjectById(nodeId);
}

export function getAllJunctionNodesForSegment(
  segment: SegmentDataModel,
): JunctionNodeDataModel[] {
  return [
    getJunctionNodeFromSegmentDirection(segment, 'forward'),
    getJunctionNodeFromSegmentDirection(segment, 'reverse'),
  ];
}

export function isSegmentConnectsToRoundabout(
  segment: SegmentDataModel,
  direction: 'forward' | 'reverse' | 'any' = 'any',
) {
  if (segment.isInRoundabout()) return false;
  if (direction === 'any') {
    return (
      isSegmentConnectsToRoundabout(segment, 'forward') ||
      isSegmentConnectsToRoundabout(segment, 'reverse')
    );
  }

  const node = getJunctionNodeFromSegmentDirection(segment, direction);
  return isJunctionNodePartOfRoundabout(node);
}

export function isSegmentDirectionAllowed(
  segment: SegmentDataModel,
  direction: 'forward' | 'reverse',
) {
  return segment.getAttribute(
    direction === 'forward' ? 'fwdDirection' : 'revDirection',
  );
}

export function getSegmentGeometryForDirection(
  segment: SegmentDataModel,
  direction: 'forward' | 'reverse',
) {
  const { coordinates } = segment.getAttribute('geoJSONGeometry');
  const clonedCoordinates = structuredClone(coordinates);

  return direction === 'forward'
    ? clonedCoordinates
    : clonedCoordinates.reverse();
}
