import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { Point, Polygon } from '@turf/helpers';

export type UserRank = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface UserEditingArea {
  area: number;
  geometry: Polygon;
  type: 'drive' | 'managed';
}

export interface UserManagedArea {
  id: number;
  name: string;
}


/*
 * `email`: Represents the primary email address associated with the user's account.
 * This attribute is defined by Waze and is essential for replicating user data accurately.
 *
 * `emailAddress`: May serve a specific or secondary role distinct from `email`. The exact purpose
 * is defined by Waze, and both attributes are necessary to replicate the user data models accurately.
 * Further clarification on the distinct roles of these attributes should be sought from Waze documentation or support.
 */
export interface UserDataModelAttributes extends DataModelAttributes {
  adOperator: boolean;
  anonymous: boolean;
  areas: UserEditingArea[];
  chatBanned: boolean;
  debugUser: boolean;
  editableCountryIDs: number[];
  editableMiles: number;
  editingNotPermittedYet: boolean;
  email: string;
  emailAddress: string;
  emailVerified: boolean;
  globalEditor: boolean;
  hasAgreedTos: boolean;
  homeLocation: Point;
  isAreaManager: boolean;
  isStaff: boolean;
  managedAreas: UserManagedArea[];
  mapEditingBanned: boolean;
  mteManager: boolean;
  onlineEditorDetails: unknown;
  profileImageUrl: string;
  rank: UserRank;
  savedIssueTrackerSearches: unknown;
  totalEdits: number;
  totalForumPosts: number;
  totalPoints: number;
  userLimits: any;
  userName: string;
  workLocation: UserRank;
}

export interface UserDataModel extends DataModel<UserDataModelAttributes> {
  canEditDifficultTurns(): boolean;
  didUserAgreeToTermsOfService(): boolean;
  getEditableArea(): UserEditingArea['geometry'];
  getEmailAddress(): string;
  getProfileImageURL(): string;
  getRank(): UserRank;
  getUsername(): string;
  hasProfileImageURL(): boolean;

  getSegmentDeletionCount(): number;
  getMaxAllowedSegmentDeletions(): number;
  decrementDeleteSegmentCount(): void;
  incrementDeleteSegmentCount(): void;
  getStreetNameChangeCount(): number;
  getMaxAllowedStreetNamesChanges(): number;
  decrementSegmentStreetChangeCount(): void;
  incrementSegmentStreetChangeCount(): void;
  resetUserLimits(): void;

  getHomeLocation(): Point;
  getWorkLocation(): Point;

  isCountryManager(): boolean;
  isEmailAddressMissing(): boolean;
  isVerifiedEmail(): boolean;
}
