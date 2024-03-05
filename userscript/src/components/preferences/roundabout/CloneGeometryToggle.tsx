import { useTranslate } from '@/hooks';
import { WzCheckbox } from '@wazespace/wme-react-components';
import React from 'react';

export function CloneGeometryToggle() {
  const t = useTranslate();

  return (
    <div className="form-group">
      <WzCheckbox>{t('jb_utils.user.prefs.roundabout.clone_geometry_toggle.label')}</WzCheckbox>
    </div>
  );
}
