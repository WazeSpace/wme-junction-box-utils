import { Turn } from '@/@waze/Waze/Model/turn';
import {
  RoundaboutTurnInstructionOpcode,
  TurnInstructionOpcode,
} from '@/@waze/Waze/Model/turn-instruction-opcode.enum';
import { groupArrayBy } from '@/utils/array-utils';
import { getAbsoluteTurnAngleInDegrees } from '@/utils/wme-entities/turn';
import {
  getDesiredInstructionFromAngle,
} from './desired-instruction-from-angle';

/**
 * Group given roundabout turns by their intended instructions.
 * @param turns The roundabout turn data models which should be grouped
 * @returns A map, where the key is the instruction to apply, and the value is an array of turns
 */
export function groupTurnsByDesiredInstruction(
  turns: Turn[],
): Map<RoundaboutTurnInstructionOpcode, Turn[]> {
  const groupedTurns = groupArrayBy(turns, (turn) => {
    const angle = getAbsoluteTurnAngleInDegrees(turn);
    return getDesiredInstructionFromAngle(angle);
  });

  // Switch to exit numeration instruction if an instruction has more than 1 exit
  const exitNumerationTurns: Turn[] = [];
  groupedTurns.forEach((turnList, turnInstructionOpcode) => {
    if (turnList.length <= 1) return;
    exitNumerationTurns.push(...turnList);
    groupedTurns.delete(turnInstructionOpcode);
  });
  groupedTurns.set(
    TurnInstructionOpcode.CountRoundaboutExits,
    exitNumerationTurns,
  );

  return groupedTurns;
}
