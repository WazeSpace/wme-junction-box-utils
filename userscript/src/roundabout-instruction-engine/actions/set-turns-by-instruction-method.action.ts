import { MultiAction, SetTurnAction } from '@/@waze/Waze/actions';
import { Turn, TurnNodes } from '@/@waze/Waze/Model/turn';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { RoundaboutInstructionMethod } from '../methods/roundabout-instruction-method-application';

export class SetTurnsByInstructionMethodAction extends MultiAction {
  actionName = 'SET_TURNS_BY_INSTRUCTION_METHOD';

  private readonly _turnInstructionMethod: RoundaboutInstructionMethod;
  private readonly _turns: TurnNodes[];

  constructor(
    turnInstructionMethod: RoundaboutInstructionMethod,
    turns: TurnNodes[],
  ) {
    super();

    this._turnInstructionMethod = turnInstructionMethod;
    this._turns = turns;
  }

  doAction(dataModel: any) {
    const turnGraph = dataModel.getTurnGraph();
    const turns = this._getTurns(turnGraph);
    const newTurns = this._turnInstructionMethod.application(turns);
    newTurns.forEach((turn) =>
      this.doSubAction(dataModel, new SetTurnAction(turnGraph, turn)),
    );
  }

  private _getTurns(turnGraph: any): Turn[] {
    return this._turns.map((turnNodes) =>
      turnGraph.getTurn(turnNodes.fromVertex, turnNodes.toVertex),
    );
  }

  generateDescription() {
    const t = (key: string, ...args) => {
      return getWazeMapEditorWindow().I18n.t(
        `jb_utils.save.changes_log.actions.SetTurnsByInstructionMethod.${key}`,
        ...args,
      );
    };

    const methodTypeTranslated = t(`types.${this._turnInstructionMethod.type}`);
    this._description = t('general', {
      count: this._turns.length,
      name: methodTypeTranslated,
    });
    return this._description;
  }
}
