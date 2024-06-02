import { Turn } from '@/@waze/Waze/Model/turn';

export type RoundaboutInstructionMethod = {
  type: string;
  application: RoundaboutInstructionMethodApplication;
};
export type RoundaboutInstructionMethodApplication = (turns: Turn[]) => Turn[];
