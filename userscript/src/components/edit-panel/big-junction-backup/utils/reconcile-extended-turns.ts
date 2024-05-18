import { Turn } from '@/@waze/Waze/Model/turn';
import { UNVERIFIED_TURN_METADATA_SYMBOL } from '../constants/meta-symbols';
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
  const isInPath = (
    possibleTurnPath: number[],
    originalTurnPath: number[],
    segmentId: number,
  ) => {
    if (vertex === 'from') {
      return isArrayInSequence(possibleTurnPath, [
        segmentId,
        ...originalTurnPath,
      ]);
    } else {
      return isArrayInSequence(possibleTurnPath, [
        ...originalTurnPath,
        segmentId,
      ]);
    }
  };
  sortedTurns.forEach((turn) => {
    const vertex = turn[vertexPropName];
    const segmentId = vertex.getSegmentID();
    sortedPossibleTurns.forEach((possibleTurn) => {
      const isExtendedTurn = isInPath(
        possibleTurn.getTurnData().getSegmentPath(),
        turn.getTurnData().getSegmentPath(),
        segmentId,
      );
      if (!isExtendedTurn) return;
      extensionList.set(possibleTurn.getID(), turn.getID());
    });
  });

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
  return currentTurns
    .map((turn) => {
      const inferedTurnId = extensionList.get(turn.getID());
      if (!inferedTurnId) {
        // this turn wasn't infered
        const originalTurn = turnsList.get(turn.getID());
        if (!originalTurn) return null; // whoops, seems like this is a new turn
        return turn.withTurnData(originalTurn.getTurnData());
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
      return updatedTurn;
    })
    .filter(Boolean); // since we ignore new turns and return null instead
}

const RECONCILE_PARAMS: Record<'from' | 'to', TurnProperties[]> = {
  from: ['restrictions', 'state'],
  to: ['restrictions', 'state', 'lanes', 'guidance'],
};

export function reconcileTurnsWithPossibleExtension(
  turns: Turn[],
  currentTurns: Turn[],
): Turn[] {
  return Object.keys(RECONCILE_PARAMS).reduce(
    (updatedTurns, params: 'from' | 'to') => {
      return reconcileTurns(
        turns,
        updatedTurns,
        params,
        RECONCILE_PARAMS[params],
      );
    },
    currentTurns,
  );
}
