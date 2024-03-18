import { Action } from '@/@waze/Waze/actions/action';

export class MultiAction<P = any> extends Action<P> {
  protected subActions: Action[];

  constructor(props?: P, subActions?: Action[]);

  doSubAction(dataModel: any, action: Action): void;
  getSubActions(): Action[];
}
