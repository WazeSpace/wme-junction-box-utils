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

export function isBidirectionalSegment(segment: SegmentDataModel): boolean {
  return (
    segment.getAttribute('fwdDirection') && segment.getAttribute('revDirection')
  );
}

export function getSegmentTravelDirection(
  segment: SegmentDataModel,
): 'forward' | 'reverse' {
  if (isBidirectionalSegment(segment)) {
    throw new Error(
      'Travel direction is not available for bidirectional segments',
    );
  }

  if (segment.getAttribute('fwdDirection')) return 'forward';
  if (segment.getAttribute('revDirection')) return 'reverse';

  throw new Error(
    'Travel direction is not available probably due to a data model structure error',
  );
}

export function getSegmentGeometryInTravelDirection(
  segment: SegmentDataModel,
): number[][] {
  return getSegmentGeometryForDirection(
    segment,
    getSegmentTravelDirection(segment),
  );
}

export function getSegmentDestinationNodeInTravelDirection(
  segment: SegmentDataModel,
): JunctionNodeDataModel {
  return getJunctionNodeFromSegmentDirection(
    segment,
    getSegmentTravelDirection(segment),
  );
}

export function getSegmentFromNodeInTravelDirection(
  segment: SegmentDataModel,
): JunctionNodeDataModel {
  return getJunctionNodeFromSegmentDirection(
    segment,
    getSegmentTravelDirection(segment) === 'forward' ? 'reverse' : 'forward',
  );
}

export function getSegmentHeadingByDirection(
  segment: SegmentDataModel,
  direction: 'fwd' | 'rev' | 'forward' | 'reverse',
): number {
  if (direction === 'fwd' || direction === 'forward')
    return segment.getFwdHeading();
  return segment.getRevHeading();
}
