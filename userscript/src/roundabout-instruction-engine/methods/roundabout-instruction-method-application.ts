import { TurnNodes } from '@/@waze/Waze/Model/turn';
import { RoundaboutTurnInstructionOpcode } from '@/@waze/Waze/Model/turn-instruction-opcode.enum';

export type RoundaboutInstructionMethod = {
  type: string;
  application: RoundaboutInstructionMethodApplication;
};
export type RoundaboutInstructionMethodApplication = (
  turns: TurnNodes[],
) => (TurnNodes & { opcode: RoundaboutTurnInstructionOpcode })[];
