import { TogglePrefsLocationButton } from './TogglePrefsLocationButton';
import { CloneGeometryToggle } from './roundabout/CloneGeometryToggle';
import { AppliedInstructionBadgeTypePreference } from './roundabout/instruction-normalization';

export function PreferencesContent() {
  return (
    <>
      <TogglePrefsLocationButton />
      <CloneGeometryToggle />
      <AppliedInstructionBadgeTypePreference />
    </>
  );
}
