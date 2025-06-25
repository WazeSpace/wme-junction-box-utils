import { Turn } from '@/@waze/Waze/Model/turn';
import {
  EXTENDED_TURN_METADATA_SYMBOL,
  UNVERIFIED_TURN_METADATA_SYMBOL,
} from '../constants/meta-symbols';
import { TurnData } from '@/@waze/Waze/Model/turn-data';

type TurnPropertyCarrier = (from: TurnData, to: TurnData) => TurnData;
type HasTurnProperty = (turn: TurnData) => boolean;
type TurnProperties =
  | 'opcode'
  | 'lanes'
  | 'restrictions'
  | 'state'
  | 'guidance';
const TURN_PROPERTIES_CARRIER: Record<
  TurnProperties,
  { carry: TurnPropertyCarrier; has: HasTurnProperty }
> = {
  opcode: {
    carry: (from, to) => to.withInstructionOpcode(from.instructionOpcode),
    has: (turn) => turn.hasInstructionOpcode(),
  },
  lanes: {
    carry: (from, to) => to.withLanes(from.lanes),
    has: (turn) => turn.hasLanes(),
  },
  restrictions: {
    carry: (from, to) => to.withRestrictions(from.restrictions),
    has: (turn) => turn.hasRestrictions(),
  },
  state: {
    carry: (from, to) => to.withState(from.state),
    has: () => true,
  },
  guidance: {
    carry: (from, to) => to.withTurnGuidance(from.turnGuidance),
    has: (turn) => turn.hasTurnGuidance(),
  },
};

function isArrayInSequence<T>(mainArray: T[], subArray: T[]): boolean {
  // Find the starting index of the first element of subArray in mainArray
  const startIndex = mainArray.indexOf(subArray[0]);

  // If the first element of subArray is not found in mainArray, return false
  if (startIndex === -1) return false;

  // Check if all elements of subArray appear consecutively in mainArray
  for (let i = 0; i < subArray.length; i++) {
    if (mainArray[startIndex + i] !== subArray[i]) return false;
  }

  return true;
}

function sortByAscPathLength(turnA: Turn, turnB: Turn) {
  const pathALength = turnA.getTurnData().getSegmentPathLength();
  const pathBLength = turnB.getTurnData().getSegmentPathLength();
  return pathALength - pathBLength;
}

function createExtensionList(
  turns: Turn[],
  possibleTurns: Turn[],
  vertex: 'from' | 'to',
): ReadonlyMap<string, string> {
  const sortedTurns = turns.toSorted(sortByAscPathLength);
  const sortedPossibleTurns = possibleTurns.toSorted(sortByAscPathLength);

  const vertexPropName = `${vertex}Vertex` as const;
  const extensionList = new Map<string, string>();
  
  // Create lookup map for O(1) access instead of O(n) find operations
  const turnsLookup = new Map<string, Turn>();
  for (const turn of turns) {
    turnsLookup.set(turn.getID(), turn);
  }

  // Pre-compute cached data for turns to avoid repeated method calls
  const turnCache = new Map<Turn, {
    segmentId: number;
    segmentPath: number[];
    fromVertexId: string;
    toVertexId: string;
  }>();
  
  for (const turn of sortedTurns) {
    const vertexObj = turn[vertexPropName];
    turnCache.set(turn, {
      segmentId: vertexObj.getSegmentID(),
      segmentPath: turn.getTurnData().getSegmentPath(),
      fromVertexId: turn.fromVertex.getID(),
      toVertexId: turn.toVertex.getID(),
    });
  }

  const possibleTurnCache = new Map<Turn, {
    segmentPath: number[];
    fromVertexId: string;
    toVertexId: string;
  }>();
  
  for (const possibleTurn of sortedPossibleTurns) {
    possibleTurnCache.set(possibleTurn, {
      segmentPath: possibleTurn.getTurnData().getSegmentPath(),
      fromVertexId: possibleTurn.fromVertex.getID(),
      toVertexId: possibleTurn.toVertex.getID(),
    });
  }

  const isInPath = (
    possibleTurnData: { segmentPath: number[]; fromVertexId: string; toVertexId: string },
    originalTurnData: { segmentPath: number[]; fromVertexId: string; toVertexId: string },
    segmentId: number,
  ) => {
    const isSameTo = originalTurnData.toVertexId === possibleTurnData.toVertexId;
    const isSameFrom = originalTurnData.fromVertexId === possibleTurnData.fromVertexId;
    const isCompletelyDifferent = !isSameFrom && !isSameTo;

    if (vertex === 'from') {
      return (
        (isSameTo || isCompletelyDifferent) &&
        isArrayInSequence(possibleTurnData.segmentPath, [segmentId, ...originalTurnData.segmentPath])
      );
    } else {
      return (
        (isSameFrom || isCompletelyDifferent) &&
        isArrayInSequence(possibleTurnData.segmentPath, [...originalTurnData.segmentPath, segmentId])
      );
    }
  };

  for (const turn of sortedTurns) {
    const turnData = turnCache.get(turn)!;
    
    for (const possibleTurn of sortedPossibleTurns) {
      const possibleTurnData = possibleTurnCache.get(possibleTurn)!;
      const isExtendedTurn = isInPath(possibleTurnData, turnData, turnData.segmentId);
      if (!isExtendedTurn) continue;
      
      const possibleTurnId = possibleTurn.getID();
      const existingExtensionId = extensionList.get(possibleTurnId);
      if (existingExtensionId) {
        const existingExtension = turnsLookup.get(existingExtensionId);
        if (!existingExtension) continue;
        // if the existing extension is more specific (has the same from/to)
        // then skip, as we must be less specific
        if (
          existingExtension.fromVertex.getID() === possibleTurnId ||
          existingExtension.toVertex.getID() === possibleTurnData.toVertexId
        ) {
          continue;
        }
      }
      extensionList.set(possibleTurnId, turn.getID());
    }
  }

  return extensionList;
}

function createTurnList(turns: Turn[]): ReadonlyMap<string, Turn> {
  return new Map(turns.map((turn) => [turn.getID(), turn] as const));
}

function markTurnAsUnverified(turn: TurnData, isUnverified: boolean) {
  Reflect.defineMetadata(UNVERIFIED_TURN_METADATA_SYMBOL, isUnverified, turn);
}

function isTurnMarkedAsUnverified(turn: TurnData): boolean {
  return Reflect.getMetadata(UNVERIFIED_TURN_METADATA_SYMBOL, turn) === true;
}

function carryoverUnverifiedMarkBetweenTurns(
  turnFrom: TurnData,
  turnTo: TurnData,
) {
  const isFromTurnUnverified = isTurnMarkedAsUnverified(turnFrom);
  markTurnAsUnverified(turnTo, isFromTurnUnverified);
}

function reconcileTurns(
  turns: Turn[],
  currentTurns: Turn[],
  vertex: 'from' | 'to',
  propertiesToCarry: TurnProperties[],
): Turn[] {
  const extensionList = createExtensionList(turns, currentTurns, vertex);
  const turnsList = createTurnList(turns);
  return currentTurns.map((turn) => {
    const inferedTurnId = extensionList.get(turn.getID());
    if (!inferedTurnId) {
      // this turn isn't extended
      const originalTurn = turnsList.get(turn.getID());
      if (originalTurn) {
        Reflect.defineMetadata(
          EXTENDED_TURN_METADATA_SYMBOL,
          true,
          originalTurn,
        );
        return originalTurn;
      }
      return turn;
    }

    const inferedTurnData = turnsList.get(inferedTurnId).getTurnData();
    let updatedTurnData: TurnData = turn.getTurnData();
    let hasIncompatiableProps: boolean = false;
    Object.keys(TURN_PROPERTIES_CARRIER).forEach(
      (turnProperty: TurnProperties) => {
        const { carry, has } = TURN_PROPERTIES_CARRIER[turnProperty];
        if (!propertiesToCarry.includes(turnProperty)) {
          if (has(inferedTurnData)) hasIncompatiableProps = true;
          return;
        }

        updatedTurnData = carry(inferedTurnData, updatedTurnData);
      },
    );
    const updatedTurn = turn.withTurnData(updatedTurnData);

    if (hasIncompatiableProps)
      markTurnAsUnverified(updatedTurn.getTurnData(), true);
    else {
      carryoverUnverifiedMarkBetweenTurns(
        turn.getTurnData(),
        updatedTurn.getTurnData(),
      );
    }
    Reflect.defineMetadata(EXTENDED_TURN_METADATA_SYMBOL, true, updatedTurn);

    return updatedTurn;
  });
}

const RECONCILE_PARAMS: Record<'from' | 'to', TurnProperties[]> = {
  from: ['restrictions', 'state'],
  to: ['restrictions', 'state', 'lanes', 'guidance'],
};

export function reconcileTurnsWithPossibleExtension(
  turns: Turn[],
  currentTurns: Turn[],
): Turn[] {
  return Object.keys(RECONCILE_PARAMS)
    .reduce((updatedTurns, params: 'from' | 'to') => {
      const newTurns = reconcileTurns(
        turns,
        updatedTurns,
        params,
        RECONCILE_PARAMS[params],
      );
      return newTurns;
    }, currentTurns)
    .filter(
      // remove any new turns that aren't extended
      (turn) =>
        Reflect.getMetadata(EXTENDED_TURN_METADATA_SYMBOL, turn) === true,
    );
}
