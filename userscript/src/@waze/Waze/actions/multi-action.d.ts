import { Action } from '@/@waze/Waze/actions/action';

export class MultiAction<P = any> extends Action<P> {
  /** The HigherOrder action takes care of additional stuff related to the action */
  static Base: typeof MultiAction<any>;
  protected subActions: Action[];

  constructor(props?: P, subActions?: Action[]);

  doSubAction(dataModel: any, action: Action): void;
  getSubActions(): Action[];
}
