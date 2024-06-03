import { Turn } from '@/@waze/Waze/Model/turn';

export type TurnInstructionMethod = {
  type: string;
  application: TurnInstructionMethodApplication;
};
export type TurnInstructionMethodApplication = (turns: Turn[]) => Turn[];
