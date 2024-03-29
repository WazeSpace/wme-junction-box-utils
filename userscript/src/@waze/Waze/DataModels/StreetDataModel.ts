import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { SegmentDataModelAttributes } from '@/@waze/Waze/DataModels/SegmentDataModel';

export interface StreetDataModelAttributes extends DataModelAttributes {
  cityID: number;
  direction: unknown | null;
  englishName: string;
  name: string;
  signText: string;
  signType: number;
}

export interface StreetDataModel extends DataModel<SegmentDataModelAttributes> {
  getName(): string;
  getSuggestionStatus(): unknown;
  get hasRoadShield(): boolean;
  setSuggestionStatus(suggestionStatus: unknown): void;
}
