import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';
import { Vertex } from '@/@waze/Waze/Vertex';
import { getBigJunctionTurns } from '@/utils/wme-entities/big-junction-turns';
import { createVertex } from '@/utils/wme-entities/segment-vertex';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { wmeSdk } from '@/utils/wme-sdk';
import { Logger } from '@/logger';
import { doAsyncMultipleActions } from '@/components/edit-panel/big-junction-backup/utils/do-async-multiple-functions';
import type { Turn as SdkTurn } from 'wme-sdk-typings';

export interface IncompatibleRestrictionDetail {
  restrictionIndex: number;
  restriction: unknown;
}

export interface IncompatibleEntity {
  type: 'segment' | 'turn' | 'restriction';
  id?: number | string;
  entity?: unknown;
}

export interface IncompatibleTurnDetail {
  turnId: string;
  fromSegmentId: number;
  toSegmentId: number;
  reasonType:
    | 'UNLOADED_DATA'
    | 'ALLOWANCE_MISMATCH'
    | 'INCOMPATIBLE_RESTRICTIONS';
  details: string;
  incompatibleEntities?: IncompatibleEntity[];
  restrictionDetails?: IncompatibleRestrictionDetail[];
}

export interface CompatibilityCheckResult {
  isCompatible: boolean;
  incompatibleTurns: IncompatibleTurnDetail[];
}

export class IncompatibleBigJunctionPathConversionError extends Error {
  readonly incompatibleTurns: IncompatibleTurnDetail[];

  constructor(incompatibleTurns: IncompatibleTurnDetail[]) {
    super('Junction Box contains incompatible turns for path conversion.');
    this.name = 'IncompatibleBigJunctionPathConversionError';
    this.incompatibleTurns = incompatibleTurns;
  }
}

export interface PathTurnBackupPayload {
  fromSegmentId: number;
  toSegmentId: number;
  isForward: boolean;
  fromVertex: Vertex;
  toVertex: Vertex;
  lanes: unknown;
  instructionOpcode: any;
  turnGuidance: unknown;
  restrictions: unknown[];
  state: any;
}

export function isPathRequiredForTurn(turn: Turn): boolean {
  const turnData = turn.getTurnData();
  if (!turnData) return false;

  const hasLanes = turnData.hasLanes();
  const hasInstruction = turnData.hasInstructionOpcode();
  const hasGuidance = turnData.hasTurnGuidance();

  return Boolean(hasLanes || hasInstruction || hasGuidance);
}

function getImmediateTurnBetweenSegments(
  dataModel: any,
  fromSegment: SegmentDataModel,
  toSegment: SegmentDataModel,
  incomingDirection?: 'forward' | 'reverse',
): { turn: Turn | null; exitDirection: 'forward' | 'reverse' } {
  if (!fromSegment || !toSegment) {
    return { turn: null, exitDirection: 'forward' };
  }

  const sIFromNodeId = fromSegment.getAttribute('fromNodeID');
  const sIToNodeId = fromSegment.getAttribute('toNodeID');
  const sIPlus1FromNodeId = toSegment.getAttribute('fromNodeID');
  const sIPlus1ToNodeId = toSegment.getAttribute('toNodeID');

  // Handle U-Turn case on the exact same segment
  if (fromSegment.getAttribute('id') === toSegment.getAttribute('id')) {
    const travelDir = incomingDirection || 'forward';
    if (travelDir === 'forward') {
      // Traffic moving forward arrives at toNodeId and U-turns in reverse
      const fromVertex = createVertex(
        fromSegment.getAttribute('id'),
        'forward',
      );
      const toVertex = createVertex(toSegment.getAttribute('id'), 'reverse');
      return {
        turn: dataModel.getTurnGraph().getTurn(fromVertex, toVertex) || null,
        exitDirection: 'reverse',
      };
    } else {
      // Traffic moving reverse arrives at fromNodeId and U-turns in forward
      const fromVertex = createVertex(
        fromSegment.getAttribute('id'),
        'reverse',
      );
      const toVertex = createVertex(toSegment.getAttribute('id'), 'forward');
      return {
        turn: dataModel.getTurnGraph().getTurn(fromVertex, toVertex) || null,
        exitDirection: 'forward',
      };
    }
  }

  let sharedNodeId: number | null = null;
  if (sIToNodeId === sIPlus1FromNodeId || sIToNodeId === sIPlus1ToNodeId) {
    sharedNodeId = sIToNodeId;
  } else if (
    sIFromNodeId === sIPlus1FromNodeId ||
    sIFromNodeId === sIPlus1ToNodeId
  ) {
    sharedNodeId = sIFromNodeId;
  }

  if (sharedNodeId === null) {
    return { turn: null, exitDirection: 'forward' };
  }

  const fromDirection: 'forward' | 'reverse' =
    sharedNodeId === sIToNodeId ? 'forward' : 'reverse';
  const toDirection: 'forward' | 'reverse' =
    sharedNodeId === sIPlus1FromNodeId ? 'forward' : 'reverse';

  const fromVertex = createVertex(
    fromSegment.getAttribute('id'),
    fromDirection,
  );
  const toVertex = createVertex(toSegment.getAttribute('id'), toDirection);

  return {
    turn: dataModel.getTurnGraph().getTurn(fromVertex, toVertex) || null,
    exitDirection: toDirection,
  };
}

export function checkBigJunctionPathsCompatibility(
  bigJunction: BigJunctionDataModel,
  dataModel: any = getWazeMapEditorWindow().W.model,
): CompatibilityCheckResult {
  const turns = getBigJunctionTurns(bigJunction) || [];
  const incompatibleTurns: IncompatibleTurnDetail[] = [];

  turns.forEach((farTurn) => {
    const turnData = farTurn.getTurnData();
    if (!turnData) return;

    const segmentPathIds: number[] = [
      farTurn.getFromVertex().getSegmentID(),
      ...(turnData.getSegmentPath() || []),
      farTurn.getToVertex().getSegmentID(),
    ];
    if (segmentPathIds.length < 2) return;

    const segments: SegmentDataModel[] = segmentPathIds
      .map((id) => dataModel.segments.getObjectById(id))
      .filter(Boolean);

    if (segments.length !== segmentPathIds.length) {
      incompatibleTurns.push({
        turnId: farTurn.getID(),
        fromSegmentId: farTurn.fromVertex.getSegmentID(),
        toSegmentId: farTurn.toVertex.getSegmentID(),
        reasonType: 'UNLOADED_DATA',
        details:
          'One or more segments in the turn segment path were not loaded in the data model.',
        incompatibleEntities: segmentPathIds
          .filter((id) => !dataModel.segments.getObjectById(id))
          .map((id) => ({ type: 'segment', id })),
      });
      return;
    }

    const isFarTurnAllowed = turnData.isAllowed();
    const farRestrictions = !turnData.isAllowed
      ? []
      : turnData.getRestrictions() || [];

    // Inverted restriction tracking: Start with all far turn restrictions as remaining
    const remainingFarRestrictions: IncompatibleRestrictionDetail[] =
      farRestrictions.map((restriction, index) => ({
        restrictionIndex: index,
        restriction,
      }));

    let currentDirection: 'forward' | 'reverse' | undefined = undefined;
    const immediateTurns: (Turn | null)[] = [];

    for (let i = 0; i < segments.length - 1; i++) {
      const { turn: immediateTurn, exitDirection } =
        getImmediateTurnBetweenSegments(
          dataModel,
          segments[i],
          segments[i + 1],
          currentDirection,
        );
      currentDirection = exitDirection;
      immediateTurns.push(immediateTurn);

      // Rule b: Match restrictions along the path to clear matched far-turn restrictions
      if (immediateTurn && remainingFarRestrictions.length > 0) {
        const immediateRestrictions =
          immediateTurn.getTurnData().getRestrictions() || [];
        immediateRestrictions.forEach((immRest) => {
          const matchIdx = remainingFarRestrictions.findIndex(
            (rem) =>
              JSON.stringify(rem.restriction) === JSON.stringify(immRest),
          );
          if (matchIdx !== -1) {
            remainingFarRestrictions.splice(matchIdx, 1);
          }
        });
      }
    }

    // Evaluate overall immediate path allowance by the end of path traversal
    const isImmediatePathAllowed =
      immediateTurns.length === segments.length - 1 &&
      immediateTurns.every(
        (t) => t !== null && Boolean(t.getTurnData()?.isAllowed()),
      );

    // Rule a: Turn allowance mismatch based on end-to-end path traversal
    if (isFarTurnAllowed !== isImmediatePathAllowed) {
      const entities: IncompatibleEntity[] = [];

      if (isFarTurnAllowed && !isImmediatePathAllowed) {
        const firstDisallowedTurn = immediateTurns.find(
          (t) => !t || !t.getTurnData()?.isAllowed(),
        );
        if (firstDisallowedTurn) {
          entities.push({
            type: 'turn',
            id: firstDisallowedTurn.getID(),
            entity: firstDisallowedTurn,
          });
        }
      }

      incompatibleTurns.push({
        turnId: farTurn.getID(),
        fromSegmentId: farTurn.fromVertex.getSegmentID(),
        toSegmentId: farTurn.toVertex.getSegmentID(),
        reasonType: 'ALLOWANCE_MISMATCH',
        details: `Path allowance mismatch for turn ${farTurn.getID()}. Far turn is ${isFarTurnAllowed ? 'allowed' : 'disallowed'}, but effective immediate path is ${isImmediatePathAllowed ? 'allowed' : 'disallowed'}.`,
        incompatibleEntities: entities,
      });
      return;
    }

    // Rule b: Any remaining far restrictions could not be inferred from immediate turns
    if (remainingFarRestrictions.length > 0) {
      incompatibleTurns.push({
        turnId: farTurn.getID(),
        fromSegmentId: farTurn.fromVertex.getSegmentID(),
        toSegmentId: farTurn.toVertex.getSegmentID(),
        reasonType: 'INCOMPATIBLE_RESTRICTIONS',
        details: `Far turn has ${remainingFarRestrictions.length} unique restriction(s) that cannot be inferred from any immediate turns along its path.`,
        incompatibleEntities: remainingFarRestrictions.map((r) => ({
          type: 'restriction',
          entity: r.restriction,
        })),
        restrictionDetails: remainingFarRestrictions,
      });
    }
  });

  return {
    isCompatible: incompatibleTurns.length === 0,
    incompatibleTurns,
  };
}

export async function convertBigJunctionToPaths(
  bigJunction: BigJunctionDataModel,
): Promise<void> {
  const window = getWazeMapEditorWindow();
  const dataModel = window.W.model;

  const compatibility = checkBigJunctionPathsCompatibility(
    bigJunction,
    dataModel,
  );
  if (!compatibility.isCompatible) {
    throw new IncompatibleBigJunctionPathConversionError(
      compatibility.incompatibleTurns,
    );
  }

  const allTurns = getBigJunctionTurns(bigJunction) || [];
  const backupsToCreate: PathTurnBackupPayload[] = [];

  allTurns.forEach((turn) => {
    const turnData = turn.getTurnData();
    if (!turnData.isAllowed()) return;
    if (!turnData.getSegmentPathLength()) return;

    const fromSegmentId = turn.fromVertex.getSegmentID();
    const toSegmentId = turn.toVertex.getSegmentID();
    const isForward = turn.toVertex.direction === 'fwd';

    if (isPathRequiredForTurn(turn)) {
      backupsToCreate.push({
        fromSegmentId,
        toSegmentId,
        isForward,
        fromVertex: turn.fromVertex,
        toVertex: turn.toVertex,
        lanes: turnData.getLaneData(),
        instructionOpcode: turnData.getInstructionOpcode(),
        turnGuidance: turnData.getTurnGuidance(),
        restrictions: turnData.getRestrictions() || [],
        state: turnData.state,
      });
    } else {
      Logger.info(
        `Path turn from segment ${fromSegmentId} to ${toSegmentId} examined and omitted: does not introduce lane or guidance overrides.`,
      );
    }
  });

  const bigJunctionId = bigJunction.getAttribute('id');
  const actionDescription = window.I18n.t(
    'jb_utils.save.changes_log.actions.ConvertBigJunctionToPaths',
  );

  await doAsyncMultipleActions(
    wmeSdk,
    async () => {
      // 1. Delete Junction Box (Paths and JBs cannot co-exist)
      (wmeSdk.DataModel.BigJunctions as any).deleteBigJunction({
        bigJunctionId,
      });

      // 2. Create path turns via SDK & re-apply backed up guidance to internal WME Turn
      backupsToCreate.forEach((backup) => {
        const sdkTurn: SdkTurn = wmeSdk.DataModel.Turns.createPathTurn({
          fromSegmentId: backup.fromSegmentId,
          isForward: backup.isForward,
          toSegmentId: backup.toSegmentId,
        });

        if (!sdkTurn) return;

        // Resolve the internal WME Turn model from the turnGraph
        const internalTurn: Turn | null =
          dataModel
            .getTurnGraph()
            .getTurn(backup.fromVertex, backup.toVertex) ||
          (dataModel.getTurnGraph().getTurnById
            ? dataModel.getTurnGraph().getTurnById(sdkTurn.id)
            : null);

        if (!internalTurn) return;

        let updatedTurnData = internalTurn.getTurnData();

        if (
          backup.instructionOpcode !== null &&
          backup.instructionOpcode !== undefined
        ) {
          updatedTurnData = updatedTurnData.withInstructionOpcode(
            backup.instructionOpcode,
          );
        }
        if (backup.turnGuidance) {
          updatedTurnData = updatedTurnData.withTurnGuidance(
            backup.turnGuidance,
          );
        }
        if (backup.lanes) {
          updatedTurnData = updatedTurnData.withLanes(backup.lanes);
        }
        if (backup.restrictions && backup.restrictions.length > 0) {
          updatedTurnData = updatedTurnData.withRestrictions(
            backup.restrictions,
          );
        }
        if (backup.state !== undefined) {
          updatedTurnData = updatedTurnData.withState(backup.state);
        }

        const SetTurnAction = window.require(
          'Waze/Model/Graph/Actions/SetTurn',
        );
        const updatedTurn = internalTurn.withTurnData(updatedTurnData);
        dataModel.actionManager.add(
          new SetTurnAction(dataModel.turnGraph, updatedTurn),
        );
      });
    },
    actionDescription,
  );
}
