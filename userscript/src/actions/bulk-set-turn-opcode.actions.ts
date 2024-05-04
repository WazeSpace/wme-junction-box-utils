import { MultiAction, SetTurnAction } from '@/@waze/Waze/actions';
import { Turn, TurnNodes } from '@/@waze/Waze/Model/turn';
import { TurnInstructionOpcode } from '@/@waze/Waze/Model/turn-instruction-opcode.enum';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

export class BulkSetTurnOpcodeActions extends MultiAction {
  actionName = 'BULK_SET_TURN_OPCODES';

  constructor(
    private _newTurns: (TurnNodes & { opcode: TurnInstructionOpcode })[],
    props?: unknown,
  ) {
    super(props);
  }

  private _doSetTurnSubAction(
    dataModel: any,
    turnNodes: TurnNodes,
    newInstruction: TurnInstructionOpcode,
  ) {
    const turnGraph = dataModel.getTurnGraph();
    const previousTurn: Turn = turnGraph.getTurn(
      turnNodes.fromVertex,
      turnNodes.toVertex,
    );
    const previousTurnData = previousTurn.getTurnData();
    const newTurn = previousTurn.withTurnData(
      previousTurnData.withInstructionOpcode(newInstruction),
    );
    this.doSubAction(dataModel, new SetTurnAction(turnGraph, newTurn));
  }

  doAction(dataModel: any) {
    this._newTurns.forEach((turn) =>
      this._doSetTurnSubAction(dataModel, turn, turn.opcode),
    );
  }

  generateDescription() {
    this._description = getWazeMapEditorWindow().I18n.t(
      'jb_utils.save.changes_log.actions.BulkSetTurn',
      { count: this._newTurns.length },
    );
    return this._description;
  }
}
