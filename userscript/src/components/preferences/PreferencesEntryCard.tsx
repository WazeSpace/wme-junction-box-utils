import { MouseEventHandler } from 'react';
import { WzCaption } from '@wazespace/wme-react-components';
import { useTranslate } from '@/hooks';
import { ListItemCard } from '../ListItemCard';
import { Logger } from '@/logger';

interface PreferencesEntryCardProps {
  onClick?: MouseEventHandler;
}

export function PreferencesEntryCard({ onClick }: PreferencesEntryCardProps) {
  const t = useTranslate();

  const handleContextMenu = async (e: React.MouseEvent) => {
    e.preventDefault();

    const { getOrCreateDebugMenu } = await import('./debug-menu');
    const menu = getOrCreateDebugMenu() as any;

    Logger.info('Log download menu triggered by right click on preference card');
    // showMenu expects a native MouseEvent which e.nativeEvent provides
    menu.showMenu(e.nativeEvent);
  };

  return (
    <ListItemCard
      onContextMenu={handleContextMenu}
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
