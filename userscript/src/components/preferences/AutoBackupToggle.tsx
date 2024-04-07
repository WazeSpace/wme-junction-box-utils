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
        onChange={(e) => setPreference((e.target as HTMLInputElement).checked)}
      >
        {t('jb_utils.user.prefs.auto_backup_on_delete')}
      </WzCheckbox>
    </div>
  );
}
