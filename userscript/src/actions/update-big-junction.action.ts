import {
  MultiAction,
  SetTurnAction,
  UpdateObjectAction,
} from '@/@waze/Waze/actions';
import { UpdateFeatureAddressAction } from '@/@waze/Waze/actions/update-feature-address.action';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { CountryDataModel } from '@/@waze/Waze/DataModels/CountryDataModel';
import { DataModel } from '@/@waze/Waze/DataModels/DataModel';
import { StateDataModel } from '@/@waze/Waze/DataModels/StateDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

interface UpdateBigJunctionActionAttributes {
  turns: Turn[];
  name?: string;
  cityName?: string;
  stateName?: string;
  countryName: string;
}
export class UpdateBigJunctionAction extends MultiAction.Base {
  actionName = 'JBU_UPDATE_BIG_JUNCTION_ACTION';

  constructor(
    private readonly _dataModel: any,
    private readonly _bigJunction: BigJunctionDataModel,
    private readonly _newAttributes: UpdateBigJunctionActionAttributes,
  ) {
    super();

    this.subActions = [
      this._createUpdateObjectAction(),
      this._createUpdateAddressAction(),
      ...this._newAttributes.turns.map(
        (turn) => new SetTurnAction(_dataModel.turnGraph, turn),
      ),
    ].filter(Boolean);
  }

  private _createUpdateObjectAction() {
    return new UpdateObjectAction(
      this._bigJunction,
      {
        name: this._newAttributes.name,
      },
      null,
    );
  }

  private _isEmptyAddress(): boolean {
    return !this._newAttributes.countryName;
  }

  private _createUpdateAddressAction() {
    if (this._isEmptyAddress()) return null;

    return new UpdateFeatureAddressAction(
      this._bigJunction,
      {
        countryID: this._getCountryByAttributes().getAttribute('id'),
        stateID: this._getStateByAttributes().getAttribute('id'),
        cityName: this._newAttributes.cityName,
        emptyCity: this._newAttributes.cityName === null,
        emptyStreet: true,
      },
      {
        updateStreet: false,
        shouldGetCityFromDataModel: false,
      },
    );
  }

  private _getCountryByAttributes(): CountryDataModel {
    const countries: CountryDataModel[] =
      this._dataModel.countries.getObjectArray();

    const country = countries.find(
      (country) => country.getName() === this._newAttributes.countryName,
    );

    if (!country) {
      throw new Error(
        `Country '${this._newAttributes.countryName}' not found.`,
      );
    }
    return country;
  }

  private _getStateByAttributes(): StateDataModel {
    if (!this._newAttributes.stateName) return this._getDefaultState();

    const country = this._getCountryByAttributes();
    const countryId = country.getAttribute('id');

    const states: StateDataModel[] = this._dataModel.states.getObjectArray();
    const state = states.find(
      (state) =>
        state.getAttribute('countryID') === countryId &&
        state.getName() === this._newAttributes.stateName,
    );

    if (!state) {
      throw new Error(
        `State '${this._newAttributes.stateName}' not found in country ID ${countryId}.`,
      );
    }
    return state;
  }

  private _getDefaultState() {
    const states: StateDataModel[] = this._dataModel.states.getObjectArray();
    return states.find((state) => state.getAttribute('isDefault'));
  }

  generateDescription(): void {
    this._description = getWazeMapEditorWindow().I18n.t(
      'jb_utils.save.changes_log.actions.UpdateBigJunction',
    );
  }

  getFocusFeatures(dataModel: any): DataModel[] {
    return this.getSubActions().flatMap((action) =>
      action.getFocusFeatures(dataModel),
    );
  }

  getAffectedUniqueIds(dataModel: any): string[] {
    return this.getSubActions().flatMap((action) =>
      action.getAffectedUniqueIds(dataModel),
    );
  }
}
