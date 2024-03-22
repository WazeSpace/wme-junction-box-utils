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

  return polygon([coordinates]).geometry;
}

export function extractRoundaboutPerimeterPolygon(
  junction: JunctionDataModel,
): Polygon {
  const segments = getAllJunctionSegments(junction);
  return extractOneWaySegmentsPerimeterPolygon(segments);
}
