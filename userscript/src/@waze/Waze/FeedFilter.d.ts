interface Attributes {
  area: string;
  cityID: any; // todo inspect, probably string or number
  commentsMaxCount: number | null; //? probably should be a number, but it has a value of null at the check time
  commentsMinCount: number | null; //? probably should be a number, but it has a value of null at the check time
  countryID: any; // todo inspect, probably string or number
  fromCreationTime: any; // todo inspect
  fromLastCommentDate: any; // todo inspect
  fromLockRank: number | null; //? probably should be a number, but it has a value of null at the check time
  fromUpdateTime: any; // todo inspect
  lastCommentBy: any; // todo inspect
  managedAreas: any; // todo inspect
  mapProblemsGroup: boolean;
  mapProblemsTypes: string[];
  mapUpdateRequestsGroup: boolean;
  mapUpdateRequestsTypes: number[];
  placeUpdateRequestsGroup: boolean;
  placeUpdateRequestsTypes: number[];
  relationToUser: any[]; // todo inspect
  stateID: any; // todo inspect, probably string or number
  status: string;
  toCreationTime: any; // todo inspect
  toLastCommentDate: any; // todo inspect
  toLockRank: number | null; //? probably should be a number, but it has a value of null at the check time
  toUpdateTime: any; // todo inspect
  updateOnMapMove: boolean;
}

export class FeedFilter {
  attributes: Attributes;
  changed: any;
  cid: string;
  _changing: boolean;
  _pending: boolean;
  _previousAttributes: any;

  defaults(): Attributes;
  isAreaManagerSearch(): boolean;
  isBBoxSearch(): boolean;
  isCountrySearch(): boolean;
}
