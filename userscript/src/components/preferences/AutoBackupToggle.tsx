import { gtag } from '@/google-analytics';
import { useTranslate, usePreference } from '@/hooks';
import { WzCheckbox } from '@wazespace/wme-react-components';

export function AutoBackupToggle() {
  const t = useTranslate();
  const [preference, setPreference] = usePreference('auto_backup');
  const isEnabled = preference === true;

  return (
    <div className="form-group">
      <WzCheckbox
        checked={isEnabled}
        onChange={(e) => {
          const newValue = (e.target as HTMLInputElement).checked;
          setPreference(newValue);
          gtag('event', 'change_preference', {
            event_category: 'preferences',
            preference_id: 'auto_backup',
            new_value: newValue
          });
        }}
      >
        {t('jb_utils.user.prefs.auto_backup_on_delete')}
      </WzCheckbox>
    </div>
  );
}
