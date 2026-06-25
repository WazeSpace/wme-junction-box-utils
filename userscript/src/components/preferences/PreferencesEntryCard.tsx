import { useState, useMemo, MouseEventHandler } from 'react';
import { WzCaption } from '@wazespace/wme-react-components';
import { useTranslate } from '@/hooks';
import { ListItemCard } from '../ListItemCard';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { Logger } from '@/logger';

interface PreferencesEntryCardProps {
  onClick?: MouseEventHandler;
}

export function PreferencesEntryCard({ onClick }: PreferencesEntryCardProps) {
  const t = useTranslate();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setVisible(true);
  };

  const handleDownloadLogs = (e: React.MouseEvent) => {
    e.stopPropagation();
    Logger.info('Log download triggered by right click on preference card');
    Logger.downloadLogs();
    setVisible(false);
  };

  const virtualReference = useMemo(() => ({
    getBoundingClientRect() {
      return {
        top: position.y,
        left: position.x,
        bottom: position.y,
        right: position.x,
        width: 0,
        height: 0,
      };
    },
  }), [position]);

  return (
    <>
      <Tippy
        visible={visible}
        onClickOutside={() => setVisible(false)}
        interactive
        animation="scale"
        placement="bottom-start"
        reference={virtualReference as any}
        getReferenceClientRect={() => virtualReference.getBoundingClientRect()}
        content={
          <wz-menu>
            <wz-menu-item onClick={handleDownloadLogs}>
              <i slot="icon" className="w-icon w-icon-download" />
              Download Logs
            </wz-menu-item>
          </wz-menu>
        }
      />
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
    </>
  );
}
