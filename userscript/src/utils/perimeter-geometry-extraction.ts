import { JunctionDataModel } from '@/@waze/Waze/DataModels/JunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { getAllJunctionSegments } from '@/utils/wme-entities/junction';
import {
  getSegmentDestinationNodeInTravelDirection,
  getSegmentFromNodeInTravelDirection,
  getSegmentGeometryInTravelDirection,
} from '@/utils/wme-entities/segment';
import { Polygon, polygon, Position } from '@turf/helpers';

function extractOneWaySegmentsPerimeterPolygon(
  segments: SegmentDataModel[],
): Polygon {
  const coordinates: Position[] = [];

  let segment: SegmentDataModel = segments[0];
  let visitedSegments = 0;

  while (visitedSegments++ < segments.length) {
    const [firstGeometryNode, ...restGeometryNodes] =
      getSegmentGeometryInTravelDirection(segment);
    if (!coordinates.length) coordinates.push(firstGeometryNode);
    coordinates.push(...restGeometryNodes);

    const node = getSegmentDestinationNodeInTravelDirection(segment);
    segment = segments.find(
      (segment) => getSegmentFromNodeInTravelDirection(segment) === node,
    );
  }

  if (
    coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
    coordinates[0][1] !== coordinates[coordinates.length - 1][1]
  ) {
    coordinates.push(coordinates[0]);
  }

  return polygon([coordinates]).geometry;
}

export function extractRoundaboutPerimeterPolygon(
  junction: JunctionDataModel,
): Polygon {
  const segments = getAllJunctionSegments(junction);
  return extractOneWaySegmentsPerimeterPolygon(segments);
}
