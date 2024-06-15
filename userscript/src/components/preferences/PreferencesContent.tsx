import { AutoBackupToggle } from './AutoBackupToggle';
import { DisableScriptToggle } from './DisableScriptToggle';
import { TogglePrefsLocationButton } from './TogglePrefsLocationButton';
import { CloneGeometryToggle } from './roundabout/CloneGeometryToggle';
import { LaneGuidanceInferArrows } from './roundabout/LaneGuidanceInferArrows';

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
      <AutoBackupToggle />
      <LaneGuidanceInferArrows />
    </>
  );
}
