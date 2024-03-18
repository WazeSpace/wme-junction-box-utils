import { Action } from '@/@waze/Waze/actions/action';
import { Turn } from '@/@waze/Waze/Model/turn';

export class SetTurnAction extends Action {
  constructor(turnGraph: any, turn: Turn, props?: any);
  getTurn(): Turn;
}
