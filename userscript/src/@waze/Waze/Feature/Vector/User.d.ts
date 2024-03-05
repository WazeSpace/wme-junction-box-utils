import type { Object } from '../../Model';

interface UserLimits {
  segmentDeletionCount: number;
  timeoutInSeconds: number;
}

export default class User extends Object {
  static readonly CLASS_NAME: string;

  adOperator: boolean;
  anonymous: boolean;
  areas: Array<{
    type: string;
    geometry: any; // todo change to OpenLayers geometry object
    area: number;
  }>;
  chatBanned: boolean;
  debugUser: boolean;
  editableCountryIDs: Array<number>;
  editableMiles: number;
  email: string;
  emailAddress: string;
  emailVerified: boolean;
  globalEditor: boolean;
  id: number;
  isAreaManager: boolean;
  isFiltered: boolean;
  isFirstLogin: boolean;
  isStaff: boolean;
  mapEditingBanned: boolean;
  maxAllowedSegmentDeletions: number;
  maxAllowedStreetNamesChanges: number;
  mteManager: boolean;
  outOfScope: boolean;
  permissionFlags: { [key: string]: number };
  permissions: number;
  persistent: boolean;
  profileImageUrl: string;
  rank: number;
  state: string;
  totalEdits: number;
  totalForumPosts: number;
  totalPoints: number;
  type: any; // todo inspect (for me it's null)
  userLimits: UserLimits;
  userName: string;

  get nested(): {
    address: any; //import('../../../OpenLayers/Geometry').default;
    areas: (e: any, t: any) => any; // todo inspect
    editableAreas: any; //import('../../../OpenLayers/Geometry').default;
    managedAreas: any; //import('../../../OpenLayers/Geometry').default;
  };

  canEditDifficultTurns(): boolean;
  decrementDeleteSegmentCount(): void;
  decrementSegmentStreetChangeCount(): void;
  getAddress(): any; // todo inspect (returns null for me)
  getEditableAreaBounds(): any; // todo inspect probably an array of OpenLayers.Bounds
  getEmailAddress(): string;
  getMaxAllowedSegmentDeletions(): number;
  getMaxAllowedStreetNamesChanges(): number;
  getProfileImageURL(): string;
  getRank(): number;
  getSegmentDeletionCount(): number;
  getStreetNameChangeCount(): number;
  hasProfileImageURL(): boolean;
  incrementDeleteSegmentCount(): void;
  incrementSegmentStreetChangeCount(): void;
  isCountryManager(): boolean;
  isEmailAddressMissing(): boolean;
  isVerifiedEmail(): boolean;
  resetUserLimits(limits: UserLimits): void;
}
