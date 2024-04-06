import {
  MultiAction,
  SetTurnAction,
  UpdateObjectAction,
} from '@/@waze/Waze/actions';
import { UpdateFeatureAddressAction } from '@/@waze/Waze/actions/update-feature-address.action';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { CountryDataModel } from '@/@waze/Waze/DataModels/CountryDataModel';
import { StateDataModel } from '@/@waze/Waze/DataModels/StateDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';

interface UpdateBigJunctionActionAttributes {
  turns: Turn[];
  name?: string;
  cityName?: string;
  stateName?: string;
  countryName: string;
}
export class UpdateBigJunctionAction extends MultiAction {
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
    ];
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

  private _createUpdateAddressAction() {
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

    return countries.find(
      (country) => country.getName() === this._newAttributes.countryName,
    );
  }

  private _getStateByAttributes(): StateDataModel {
    if (!this._newAttributes.stateName) return this._getDefaultState();

    const country = this._getCountryByAttributes();
    const countryId = country.getAttribute('id');

    const states: StateDataModel[] = this._dataModel.states.getObjectArray();
    return states.find(
      (state) =>
        state.getAttribute('countryID') === countryId &&
        state.getName() === this._newAttributes.stateName,
    );
  }

  private _getDefaultState() {
    const states: StateDataModel[] = this._dataModel.states.getObjectArray();
    return states.find((state) => state.getAttribute('isDefault'));
  }
}
