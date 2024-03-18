import { Action } from '@/@waze/Waze/actions/action';
import {
  DataModel,
  ExtractAttributesFromDataModel,
} from '@/@waze/Waze/DataModels/DataModel';

export class UpdateObjectAction<DM extends DataModel> extends Action {
  actionName: 'UPDATE_OBJECT';

  constructor(
    object: DM,
    newAttributes: Partial<ExtractAttributesFromDataModel<DM>>,
    props: unknown,
  );

  getNewAttributes(): Record<string, any>;
  getOldAttributes(): Record<string, any>;
  getObject(): any;
}
