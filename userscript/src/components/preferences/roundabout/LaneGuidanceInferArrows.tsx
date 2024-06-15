import { usePreference, useTranslate } from '@/hooks';
import { WzCheckbox } from '@wazespace/wme-react-components';

export function LaneGuidanceInferArrows() {
  const t = useTranslate('jb_utils.user.prefs');
  const [preference, setPreference] = usePreference(
    'auto_set_roundabout_lane_guidance_turn_arrows',
  );
  const isEnabled = preference === true;

  return (
    <div className="form-group">
      <WzCheckbox
        checked={isEnabled}
        onChange={(e) => setPreference((e.target as HTMLInputElement).checked)}
        style={{
          display: 'inline-block',
          marginInlineEnd: '4px',
        }}
      >
        {t('infer_roundabout_lane_guidance_turn_arrows')}
      </WzCheckbox>
    </div>
  );
}
