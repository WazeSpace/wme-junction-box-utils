import { CountryDataModel } from '@/@waze/Waze/DataModels/CountryDataModel';
import {
  LaneGuidanceControlModel,
  LaneGuidanceControlTurnModel,
} from '@/components/edit-panel/lg-auto-turn-arrow/models';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { parseVertexId } from '@/utils/wme-entities/segment-vertex';
import { getSegmentHeadingByDirection } from '@/utils/wme-entities/segment';

const arrowStyleStopPoints = [
  { styleAngle: 135, stopPoint: 67.5 },
  { styleAngle: 90, stopPoint: 112.5 },
  { styleAngle: 45, stopPoint: 157.5 },
  { styleAngle: 0, stopPoint: 202.5 },
  { styleAngle: -45, stopPoint: 247.5 },
  { styleAngle: -90, stopPoint: 292.5 },
  { styleAngle: -135, stopPoint: 360 },
];

function isUTurn(turnModel: LaneGuidanceControlTurnModel): boolean {
  const fromVertex = parseVertexId(turnModel.get('fromVertexID'));
  const toVertex = parseVertexId(turnModel.get('toVertexID'));
  const oppositeDirection = fromVertex.direction === 'fwd' ? 'rev' : 'fwd';

  if (fromVertex.segmentId === toVertex.segmentId && oppositeDirection === toVertex.direction) {
    return true;
  }

  const dataModel = getWazeMapEditorWindow().W.model;
  const fromSegment = dataModel.segments.getObjectById(fromVertex.segmentId);
  const toSegment = dataModel.segments.getObjectById(toVertex.segmentId);
  const fromSegmentAddress = fromSegment.getAddress().format();
  const toSegmentAddress = toSegment.getAddress().format();
  const isAddressEquals = fromSegmentAddress === toSegmentAddress;
  const fromSegmentRoadType = fromSegment.getAttribute('roadType');
  const toSegmentRoadType = toSegment.getAttribute('roadType');

  if (fromSegmentRoadType === toSegmentRoadType) {
    if (
      (isAddressEquals || fromSegmentRoadType === toSegmentRoadType) &&
      getSegmentHeadingByDirection(
        fromSegment,
        oppositeDirection,
      ) === getSegmentHeadingByDirection(toSegment, toVertex.direction)
    ) {
      return true;
    }
  }

  return false;
}

function getArrowAngleByTurnAngle(
  turnAngle: number,
  uTurnArrowAngle: number,
): number {
  const normalizedFarTurnAngle =
    turnAngle > 0 ? 180 - turnAngle : Math.abs(turnAngle - 180);
  for (const arrowStyleStopPoint of arrowStyleStopPoints) {
    if (normalizedFarTurnAngle < arrowStyleStopPoint.stopPoint)
      return arrowStyleStopPoint.styleAngle;
  }
  return uTurnArrowAngle;
}

export function setControlTurnArrows(control: LaneGuidanceControlModel) {
  const topCountry: CountryDataModel =
    getWazeMapEditorWindow().W.model.getTopCountry();
  const isLeftHandTraffic = topCountry.getAttribute('leftHandTraffic');
  const uTurnArrowAngle = isLeftHandTraffic ? 180 : -180;
  const farTurns = control.get('farTurns');
  farTurns.forEach((farTurn) => {
    const farTurnAngle = farTurn.get('farTurnAngle');
    if (isUTurn(farTurn)) farTurn.set('angleOverride', uTurnArrowAngle);
    else {
      const mappedArrowAngle = getArrowAngleByTurnAngle(
        farTurnAngle,
        uTurnArrowAngle,
      );
      farTurn.set('angleOverride', mappedArrowAngle);
    }
  });
}
