import { Turn } from '@/@waze/Waze/Model/turn';
import { getAngleBetweenLinesInDegrees, Line } from '@/utils/lines';
import { getSegmentGeometryFromVertex } from '@/utils/wme-entities/vertex';

export function sortFarTurnsBySegmentPathLength(turns: Turn[]) {
  const getSegmentPathLength = (turn: Turn) => {
    return turn.getTurnData().getSegmentPathLength();
  };

  return turns.toSorted(
    (a, b) => getSegmentPathLength(a) - getSegmentPathLength(b),
  );
}

export function getAbsoluteTurnAngleInDegrees(turn: Turn): number {
  const { fromLine, toLine } = extractLinesFromVertices(turn);

  const angle = getAngleBetweenLinesInDegrees(fromLine, toLine);
  return Math.abs(angle);
}

function extractLinesFromVertices(turn: Turn): {
  fromLine: Line;
  toLine: Line;
} {
  const fromGeometry = getSegmentGeometryFromVertex(turn.getFromVertex());
  const toGeometry = getSegmentGeometryFromVertex(turn.getToVertex());

  const fromLine: Line = {
    startY: fromGeometry[fromGeometry.length - 2][0],
    startX: fromGeometry[fromGeometry.length - 2][1],
    endY: fromGeometry[fromGeometry.length - 1][0],
    endX: fromGeometry[fromGeometry.length - 1][1],
  };

  const toLine: Line = {
    startY: toGeometry[0][0],
    startX: toGeometry[0][1],
    endY: toGeometry[1][0],
    endX: toGeometry[1][1],
  };

  return { fromLine, toLine };
}
