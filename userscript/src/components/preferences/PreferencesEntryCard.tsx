import { WzCaption } from '@wazespace/wme-react-components';
import { MouseEventHandler } from 'react';
import { useTranslate } from '@/hooks';
import { ListItemCard } from '../ListItemCard';

interface PreferencesEntryCardProps {
  onClick?: MouseEventHandler;
}
export function PreferencesEntryCard({ onClick }: PreferencesEntryCardProps) {
  const t = useTranslate();

  return (
    <ListItemCard
      leftIcon="script"
      rightIcon="chevron-right"
      rightIconStyle={{
        backgroundColor: 'transparent',
        color: 'var(--content_default, #202124)',
        justifyContent: 'end',
        justifySelf: 'end',
      }}
      onClick={onClick}
    >
      <div className="list-item-card-title">{process.env.SCRIPT_NAME}</div>
      <WzCaption>{t('jb_utils.user.prefs.card_helper_text')}</WzCaption>
    </ListItemCard>
  );
}
