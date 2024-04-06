import { Action } from '@/@waze/Waze/actions/action';
import { DataModel } from '@/@waze/Waze/DataModels/DataModel';

export interface UpdateFeatureAddressAttributes {
  countryID: number;
  stateID: number;

  emptyCity: boolean;
  cityID: number;
  cityName: string;

  emptyStreet: boolean;
  streetName: string;

  houseNumber: number;
}

export interface UpdateFeatureAddressOptions {
  cityIDField: string;
  shouldGetCityFromDataModel: boolean;
  streetIDField: string;
  updateStreet: boolean;
}

export class UpdateFeatureAddressAction<DM extends DataModel> extends Action {
  actionName: 'UPDATE_FEATURE_ADDRESS';
  constructor(
    dataModel: DM,
    attributes: Partial<UpdateFeatureAddressAttributes>,
    options?: Partial<UpdateFeatureAddressOptions>,
  );
}
