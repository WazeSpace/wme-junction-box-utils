import {
  RoundaboutTurnInstructionOpcode,
  TurnInstructionOpcode,
} from '@/@waze/Waze/Model/turn-instruction-opcode.enum';

export function getDesiredInstructionFromAngle(
  angle: number,
): RoundaboutTurnInstructionOpcode {
  if (angle >= 45 && angle < 135) return TurnInstructionOpcode.TurnLeft;
  if (angle >= 135 && angle < 225) return TurnInstructionOpcode.UTurn;
  if (angle >= 225 && angle < 315) return TurnInstructionOpcode.TurnRight;
  return TurnInstructionOpcode.Continue;
}
