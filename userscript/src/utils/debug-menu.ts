import { logStream } from '@/logger';

export interface WzMenuElement extends HTMLElement {
  showMenu(event: MouseEvent | PointerEvent): void;
}

export function showDebugMenu(event: MouseEvent) {
  event.preventDefault();

  let menu = document.querySelector(
    'wz-menu#wme-jb-utils-debug-menu',
  ) as WzMenuElement;

  if (!menu) {
    menu = document.createElement('wz-menu') as WzMenuElement;
    menu.id = 'wme-jb-utils-debug-menu';
    menu.setAttribute('fixed', 'true');

    // Create menu items
    const downloadLogsItem = document.createElement('wz-menu-item');
    downloadLogsItem.innerHTML = 'Download Logs';
    downloadLogsItem.addEventListener('click', () => {
      logStream.debug('Downloading logs via debug menu...');
      logStream
        .downloadLogs(
          `wme-junction-box-utils-logs-${new Date().toISOString()}.xlog`,
        )
        .catch((err) => {
          logStream.error('Failed to download logs', err);
        });
    });

    // Add divider before version info
    const divider = document.createElement('wz-menu-divider');

    // Create debug info item (non-clickable)
    const debugInfoItem = document.createElement('div');
    debugInfoItem.style.padding =
      'var(--wz-menu-option-padding, var(--space-always-s, 12px))';
    debugInfoItem.style.minHeight =
      'var(--wz-menu-option-height, var(--wz-option-height, 40px))';
    debugInfoItem.innerHTML = `
      <wz-overline>${process.env.SCRIPT_NAME} Debug Menu</wz-overline>
      <div style="display: flex; flex-direction: column">
        <wz-caption>Version: ${process.env.VERSION}</wz-caption>
      </div>
    `;

    menu.appendChild(downloadLogsItem);
    menu.appendChild(divider);
    menu.appendChild(debugInfoItem);

    document.body.appendChild(menu);
  }

  menu.showMenu(event);
}
