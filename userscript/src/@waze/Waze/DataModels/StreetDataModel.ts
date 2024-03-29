import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';

export interface StreetDataModelAttributes extends DataModelAttributes {
  cityID: number;
  direction: unknown | null;
  englishName: string;
  name: string;
  signText: string;
  signType: number;
}

export interface StreetDataModel extends DataModel<StreetDataModelAttributes> {
  getName(): string;
  getSuggestionStatus(): unknown;
  get hasRoadShield(): boolean;
  setSuggestionStatus(suggestionStatus: unknown): void;
}
