import { DisableScriptToggle } from './DisableScriptToggle';
import { TogglePrefsLocationButton } from './TogglePrefsLocationButton';
import { CloneGeometryToggle } from './roundabout/CloneGeometryToggle';
import { AppliedInstructionBadgeTypePreference } from './roundabout/instruction-normalization';

export function PreferencesContent() {
  return (
    <>
      <div
        className="form-group"
        style={{
          display: 'flex',
          gap: 8,
        }}
      >
        <DisableScriptToggle />
        <TogglePrefsLocationButton />
      </div>
      <CloneGeometryToggle />
      <AppliedInstructionBadgeTypePreference />
    </>
  );
}
