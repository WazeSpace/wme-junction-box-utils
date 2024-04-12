import { useTranslate, usePreference } from '@/hooks';
import { WzCheckbox, WzTooltip } from '@wazespace/wme-react-components';
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
        style={{
          display: 'inline-block',
          marginInlineEnd: '4px',
        }}
      >
        {t('jb_utils.user.prefs.roundabout.clone_geometry_toggle.label')}
      </WzCheckbox>

      <wz-basic-tooltip
        style={{
          '--wz-tooltip-content-width': '400px',
          '--wz-tooltip-content-white-space': 'normal',
        }}
      >
        <wz-tooltip-source>
          <i className="w-icon w-icon-info" />
        </wz-tooltip-source>
        <wz-tooltip-target />
        <wz-tooltip-content>
          {t('jb_utils.user.prefs.roundabout.clone_geometry_toggle.help_label')}
        </wz-tooltip-content>
      </wz-basic-tooltip>
    </div>
  );
}
