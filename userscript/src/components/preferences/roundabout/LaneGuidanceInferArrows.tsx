import { gtag } from '@/google-analytics';
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
        onChange={(e) => {
          const newValue = (e.target as HTMLInputElement).checked;
          setPreference(newValue);
          gtag('event', 'change_preference', {
            event_category: 'preferences',
            preference_id: 'auto_set_roundabout_lane_guidance_turn_arrows',
            new_value: newValue
          });
        }}
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
