import { MultiAction, SetTurnAction } from '@/@waze/Waze/actions';
import { Turn, TurnNodes } from '@/@waze/Waze/Model/turn';
import { TurnInstructionOpcode } from '@/@waze/Waze/Model/turn-instruction-opcode.enum';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

export class BulkSetTurnOpcodeActions extends MultiAction {
  actionName = 'BULK_SET_TURN_OPCODES';

  constructor(
    private _turnGraph: any,
    private _newTurns: (TurnNodes & { opcode: TurnInstructionOpcode })[],
    props?: unknown,
  ) {
    super(props);
    this.subActions = this._createAllSetTurnActions();
  }

  private _createSingleSetTurnAction(
    turnNodes: TurnNodes,
    newInstruction: TurnInstructionOpcode,
  ): SetTurnAction {
    const previousTurn: Turn = this._turnGraph.getTurn(
      turnNodes.fromVertex,
      turnNodes.toVertex,
    );
    const previousTurnData = previousTurn.getTurnData();
    const newTurn = previousTurn.withTurnData(
      previousTurnData.withInstructionOpcode(newInstruction),
    );
    return new SetTurnAction(this._turnGraph, newTurn);
  }

  private _createAllSetTurnActions(): SetTurnAction[] {
    const actions: SetTurnAction[] = [];
    this._newTurns.forEach((turn) => {
      actions.push(this._createSingleSetTurnAction(turn, turn.opcode));
    });
    return actions;
  }

  generateDescription() {
    this._description = getWazeMapEditorWindow().I18n.t(
      'jb_utils.save.changes_log.actions.BulkSetTurn',
      { count: this._newTurns.length },
    );
  }
}
