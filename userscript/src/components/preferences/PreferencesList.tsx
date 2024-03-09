import { CloneGeometryToggle } from '@/components/preferences/roundabout/CloneGeometryToggle';
import { AppliedInstructionBadgeTypePreference } from '@/components/preferences/roundabout/instruction-normalization';
import styled from '@emotion/styled';
import { WzSectionHeader } from '@wazespace/wme-react-components';
import React, { EventHandler, SyntheticEvent } from 'react';
import { useTranslate } from '@/hooks';

const PreferencesPanel = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#fff',
  zIndex: 999,
});
const PreferencesContentPanel = styled('div')({
  padding: '1rem',
});

interface PreferencesProps {
  onClosed?(event: CustomEvent): void;
}
export function PreferencesList(props: PreferencesProps) {
  const t = useTranslate();

  return (
    <PreferencesPanel>
      <WzSectionHeader
        size="section-header2"
        headline={t('user.prefs.subtitle')}
        subtitle={process.env.SCRIPT_NAME}
        slotIcon={<i className="w-icon w-icon-settings" />}
        backButton
        onBackClicked={props.onClosed}
      />

      <PreferencesContentPanel>
        <CloneGeometryToggle />
        <AppliedInstructionBadgeTypePreference />
      </PreferencesContentPanel>
    </PreferencesPanel>
  );
}
