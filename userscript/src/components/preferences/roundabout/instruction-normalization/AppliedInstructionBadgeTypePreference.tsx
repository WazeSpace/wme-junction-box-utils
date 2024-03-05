import { WzCheckableChip, WzChipSelect, WzLabel } from '@wazespace/wme-react-components';
import { useTranslate } from '@/hooks';

export function AppliedInstructionBadgeTypePreference() {
  const t = useTranslate();

  return (
    <div className="form-group">
      <WzLabel>
        {t('jb_utils.user.prefs.roundabout.instruction_normalization.applied_instruction_badge_type.label')}
      </WzLabel>
      <WzChipSelect>
        <WzCheckableChip showCheckIconWhenChecked={false}>
          {t('jb_utils.user.prefs.roundabout.instruction_normalization.applied_instruction_badge_type.graphical.label')}
        </WzCheckableChip>
        <WzCheckableChip showCheckIconWhenChecked={false}>
          {t('jb_utils.user.prefs.roundabout.instruction_normalization.applied_instruction_badge_type.textual.label')}
        </WzCheckableChip>
      </WzChipSelect>
    </div>
  );
}
