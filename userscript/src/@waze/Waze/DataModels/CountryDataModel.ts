import { PermanentHazardType, RoadType } from '@/@waze/Waze/enums';
import { Environments } from '../environments';
import { DataModel, DataModelAttributes } from './DataModel';
import { UserRank } from './UserDataModel';

export interface CountryDataModelAttributes extends DataModelAttributes {
  abbr: string;
  allowAverageSpeedCamerasRank: UserRank;
  allowCamerasRank: UserRank;
  allowEditingEscalatedSegmentSuggestionsRank: UserRank;
  allowEditingLanesOnJBPathsRank: UserRank;
  allowEditingPathsRank: UserRank;
  allowEditingPermanentHazardsRank: UserRank;
  allowEditingSegmentSuggestionsRank: UserRank;
  allowEditingStreetsRank: UserRank;
  allowEditingTurnGuidanceRank: UserRank;
  allowHeadlightsReminderRank: UserRank;
  allowLanesRank: UserRank;
  allowLicensePlatesRestrictions: UserRank;
  allowNewCitiesRank: UserRank;
  allowPickupRestrictions: UserRank;
  allowRailroadCrossingsRank: UserRank;
  allowRestrictedDrivingAreaRank: UserRank;
  allowRoadClosureRank: UserRank;
  allowSpeedCams: UserRank;
  allowViewingStreetAttributesRank: UserRank;
  allowViewingTurnGuidanceRank: UserRank;
  defaultLaneWidth: number;
  defaultLaneWidthPerRoadType: Record<RoadType, number>;
  env: Environments;
  forceHouseNumberRank: UserRank;
  id: number;
  leftHandTraffic: boolean;
  name: string;
  restrictionSubscriptions: Record<string, string>;
  supportedPermanentHazardTypes: PermanentHazardType[];
  trafficSide: 'RIGHT' | 'LEFT';
  ttsLocales: Array<{
    tts: string;
    locale: string;
  }>;
  updateJunctionBoxRank: UserRank;
  venueImageUploadMinRank: UserRank;
}

export interface CountryDataModel
  extends DataModel<CountryDataModelAttributes> {
  getLaneWidthByRoadType(roadType: RoadType): number;
  getName(): string;
  toJSON(): object;
}
