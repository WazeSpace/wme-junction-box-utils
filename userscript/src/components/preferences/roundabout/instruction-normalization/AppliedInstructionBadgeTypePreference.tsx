import { Preferences } from '@/preferences';
import styled from '@emotion/styled';
import {
  WzCheckableChip,
  WzChipSelect,
  WzLabel,
  WzTooltip,
} from '@wazespace/wme-react-components';
import { usePreference, useTranslate } from '@/hooks';
import { WzChipSelectProps } from '@wazespace/wme-react-components/build/wme-intrinsic-elements-props';
import { useState } from 'react';

const SpaciousWzChipSelect = styled(WzChipSelect)({
  display: 'flex',
  gap: '2px',
  flexWrap: 'wrap',
  '--wz-chip-checked-background-color': 'var(--primary)',
  '--wz-chip-checked-color': 'var(--on_primary)',
  '--wz-chip-checked-border-color': 'transparent',
});

export function AppliedInstructionBadgeTypePreference() {
  const t = useTranslate();
  const [selectedBadgeType, setSelectedBadgeType] = usePreference(
    'roundabout.instruction_normalization.applied_instruction_badge_type',
  );

  const handleBadgeTypeChange: WzChipSelectProps['onChipSelected'] = (
    event,
  ) => {
    if (!event.detail.value) {
      event.preventDefault();
      return;
    }

    setSelectedBadgeType(event.detail.value as typeof selectedBadgeType);
  };

  return (
    <div className="form-group">
      <WzLabel>
        {t(
          'jb_utils.user.prefs.roundabout.instruction_normalization.applied_instruction_badge_type.label',
        )}
      </WzLabel>
      <SpaciousWzChipSelect
        value={selectedBadgeType}
        onChipSelected={handleBadgeTypeChange}
      >
        <WzTooltip
          tooltipContent={t(
            'jb_utils.user.prefs.roundabout.instruction_normalization.applied_instruction_badge_type.graphical.description'
          )}
        >
          <BadgeTypeCheckableChip
            checked={selectedBadgeType === 'graphical'}
            value="graphical"
          />
        </WzTooltip>
        <WzTooltip
          tooltipContent={t(
            'jb_utils.user.prefs.roundabout.instruction_normalization.applied_instruction_badge_type.textual.description'
          )}
        >
          <BadgeTypeCheckableChip
            checked={selectedBadgeType === 'textual'}
            value="textual"
          />
        </WzTooltip>
      </SpaciousWzChipSelect>
    </div>
  );
}

interface BadgeTypeCheckableChipProps {
  value: Preferences['roundabout']['instruction_normalization']['applied_instruction_badge_type'];
  checked: boolean;
}
function BadgeTypeCheckableChip(props: BadgeTypeCheckableChipProps) {
  const t = useTranslate();
  const [internallySelected, setInternallySelected] = useState();

  return (
    <WzCheckableChip
      checked={props.checked ?? internallySelected}
      value={props.value}
      showCheckIconWhenChecked={false}
      onChipChanged={(event) => setInternallySelected(event.detail)}
    >
      {t(
        `jb_utils.user.prefs.roundabout.instruction_normalization.applied_instruction_badge_type.${props.value}.label`,
      )}
    </WzCheckableChip>
  );
}
