import { AutoBackupToggle } from './AutoBackupToggle';
import { DisableScriptToggle } from './DisableScriptToggle';
import { TogglePrefsLocationButton } from './TogglePrefsLocationButton';
import { CloneGeometryToggle } from './roundabout/CloneGeometryToggle';
import { LaneGuidanceInferArrows } from './roundabout/LaneGuidanceInferArrows';
import { useEffect } from 'react';
import { Logger } from '@/logger';
import { usePreference } from '@/hooks';

const trackSettings = Logger.logStream.createStateTracker('editorSettings');

export function PreferencesContent() {
  const [autoBackup] = usePreference('auto_backup');
  const [cloneGeometry] = usePreference('clone_geometry');
  const [inferArrows] = usePreference('auto_turn_arrow');
  const [prefsLocation] = usePreference('prefs_location');

  useEffect(() => {
    trackSettings({
      auto_backup: autoBackup,
      clone_geometry: cloneGeometry,
      auto_turn_arrow: inferArrows,
      prefs_location: prefsLocation,
    });
  }, [autoBackup, cloneGeometry, inferArrows, prefsLocation]);

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
