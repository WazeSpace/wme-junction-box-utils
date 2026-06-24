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
        getReferenceClientRect={() => virtualReference.getBoundingClientRect()}
        content={
          <div style={{ padding: '4px', cursor: 'pointer', background: 'white', color: 'black', borderRadius: '4px', border: '1px solid #ccc' }} onClick={handleDownloadLogs}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="w-icon w-icon-download" />
              <span>Download Logs</span>
            </div>
          </div>
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
