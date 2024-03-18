import { MultiAction, SetTurnAction } from '@/@waze/Waze/actions';
import { Turn } from '@/@waze/Waze/Model/turn';
import { TurnInstructionOpcode } from '@/@waze/Waze/Model/turn-instruction-opcode.enum';

export class ApplyTurnInstructionsFromMapAction extends MultiAction {
  actionName = 'APPLY_TURN_INSTRUCTIONS_FROM_MAP';

  constructor(
    private _turnGraph: any,
    private _newInstructionsMap: Map<TurnInstructionOpcode, Turn[]>,
    props?: unknown,
  ) {
    super(props);
    this.subActions = this._createAllSetTurnActions();
  }

  private _createSingleSetTurnAction(
    turn: Turn,
    newInstruction: TurnInstructionOpcode,
  ): SetTurnAction {
    const previousTurn: Turn = this._turnGraph.getTurn(
      turn.getFromVertex(),
      turn.getToVertex(),
    );
    const previousTurnData = previousTurn.getTurnData();
    const newTurn = previousTurn.withTurnData(
      previousTurnData.withInstructionOpcode(newInstruction),
    );
    return new SetTurnAction(this._turnGraph, newTurn);
  }

  private _createAllSetTurnActions(): SetTurnAction[] {
    const actions: SetTurnAction[] = [];
    this._newInstructionsMap.forEach((turns, instruction) => {
      actions.push(
        ...turns.map((turn) =>
          this._createSingleSetTurnAction(turn, instruction),
        ),
      );
    });
    return actions;
  }
}
