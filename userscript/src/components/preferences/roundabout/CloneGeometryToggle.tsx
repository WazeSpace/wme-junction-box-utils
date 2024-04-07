import { useTranslate, usePreference } from '@/hooks';
import { WzCheckbox } from '@wazespace/wme-react-components';
import React from 'react';

export function CloneGeometryToggle() {
  const t = useTranslate();
  const [preference, setPreference] = usePreference(
    'roundabout.clone_geometry',
  );
  const isEnabled = preference === true;
  const isDetermined = preference !== 'ask';

  return (
    <div className="form-group">
      <WzCheckbox
        checked={isEnabled && isDetermined}
        indeterminate={!isDetermined}
        onChange={(e) => setPreference((e.target as HTMLInputElement).checked)}
      >
        {t('jb_utils.user.prefs.roundabout.clone_geometry_toggle.label')}
      </WzCheckbox>
    </div>
  );
}
