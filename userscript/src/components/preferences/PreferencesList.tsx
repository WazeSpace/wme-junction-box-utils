import styled from '@emotion/styled';
import { WzSectionHeader } from '@wazespace/wme-react-components';
import { useTranslate } from '@/hooks';
import { PreferencesContent } from './PreferencesContent';

const PreferencesPanel = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--background_default, #fff)',
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
        <PreferencesContent />
      </PreferencesContentPanel>
    </PreferencesPanel>
  );
}
