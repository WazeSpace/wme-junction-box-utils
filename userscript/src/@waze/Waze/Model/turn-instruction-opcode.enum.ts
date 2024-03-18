export enum TurnInstructionOpcode {
  Continue = 'CONTINUE',
  ExitLeft = 'EXIT_LEFT',
  ExitRight = 'EXIT_RIGHT',
  KeepLeft = 'KEEP_LEFT',
  KeepRight = 'KEEP_RIGHT',
  TurnLeft = 'TURN_LEFT',
  TurnRight = 'TURN_RIGHT',
  UTurn = 'UTURN',
  CountRoundaboutExits = 'ROUNDABOUT_ENTER',
  None = 'None',
}

export type RoundaboutTurnInstructionOpcode = Extract<
  TurnInstructionOpcode,
  | TurnInstructionOpcode.Continue
  | TurnInstructionOpcode.TurnRight
  | TurnInstructionOpcode.TurnLeft
  | TurnInstructionOpcode.UTurn
  | TurnInstructionOpcode.CountRoundaboutExits
  | TurnInstructionOpcode.None
>;
