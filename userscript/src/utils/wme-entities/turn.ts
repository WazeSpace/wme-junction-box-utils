import { UserDataModel } from '@/@waze/Waze/DataModels/UserDataModel';
import { Turn, TurnNodes } from '@/@waze/Waze/Model/turn';
import { TurnData } from '@/@waze/Waze/Model/turn-data';
import { Vertex } from '@/@waze/Waze/Vertex';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { getAngleBetweenLinesInDegrees, Line } from '@/utils/lines';
import { getCountryByStreet, getToStreetByTurn } from '@/utils/location';
import { createVertex } from '@/utils/wme-entities/segment-vertex';
import { getSegmentGeometryFromVertex } from '@/utils/wme-entities/vertex';

export function sortFarTurnsBySegmentPathLength(turns: Turn[]) {
  const getSegmentPathLength = (turn: Turn) => {
    return turn.getTurnData().getSegmentPathLength();
  };

  return turns.toSorted(
    (a, b) => getSegmentPathLength(a) - getSegmentPathLength(b),
  );
}

export function getAbsoluteTurnAngleInDegrees(turn: TurnNodes): number {
  const { fromLine, toLine } = extractLinesFromVertices(turn);

  const angle = getAngleBetweenLinesInDegrees(fromLine, toLine);
  return Math.abs(angle);
}

function extractLinesFromVertices(turn: TurnNodes): {
  fromLine: Line;
  toLine: Line;
} {
  const fromGeometry = getSegmentGeometryFromVertex(turn.fromVertex);
  const toGeometry = getSegmentGeometryFromVertex(turn.toVertex);

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

export function canUserEditTurnGuidanceForTurn(
  dataModel: any, // the type is set temporarily to any, because we don't have a more accurate type
  user: UserDataModel,
  turn: Turn,
): boolean {
  const country = getCountryByStreet(
    dataModel,
    getToStreetByTurn(dataModel, turn),
  );

  const rankToEditTG = country.getAttribute('allowEditingTurnGuidanceRank');
  if (user.getRank() < rankToEditTG) return false;
  if (turn.isJunctionBoxTurn()) {
    const rankToEditBigJunction = country.getAttribute('updateJunctionBoxRank');
    return user.getRank() >= rankToEditBigJunction;
  }

  return true;
}

function getTurnPrototype(): {
  new (fromVertex: Vertex, toVertex: Vertex, data: TurnData): Turn;
} {
  const turnGraph = getWazeMapEditorWindow().W.model.turnGraph;
  const dummyVertex = createVertex(NaN, 'forward');
  const turn: Turn = turnGraph.getTurn(dummyVertex, dummyVertex);
  return Object.getPrototypeOf(turn);
}

export function createTurn(
  fromVertex: Vertex,
  toVertex: Vertex,
  data: TurnData,
): Turn {
  const turnPrototype = getTurnPrototype();
  return new turnPrototype(fromVertex, toVertex, data);
}
