import { useTranslate, usePreference } from '@/hooks';
import { WzCheckbox } from '@wazespace/wme-react-components';
import React from 'react';

export function CloneGeometryToggle() {
  const t = useTranslate();
  const [isEnabled, setEnabled] = usePreference('roundabout.clone_geometry');

  return (
    <div className="form-group">
      <WzCheckbox checked={isEnabled} onChange={(e) => setEnabled((e.target as HTMLInputElement).checked)}>
        {t('jb_utils.user.prefs.roundabout.clone_geometry_toggle.label')}
      </WzCheckbox>
    </div>
  );
}
