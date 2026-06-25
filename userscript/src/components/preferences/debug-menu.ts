import { Logger } from '@/logger';

export function getOrCreateDebugMenu(): HTMLElement {
  let menu = document.querySelector('wz-menu#wme-jbu-debug-menu') as HTMLElement;

  if (!menu) {
    menu = document.createElement('wz-menu');
    menu.id = 'wme-jbu-debug-menu';
    menu.setAttribute('fixed', 'true');

    const downloadLogsItem = document.createElement('wz-menu-item');
    downloadLogsItem.innerHTML = '<i slot="icon" class="w-icon w-icon-download"></i> Download Logs';
    downloadLogsItem.addEventListener('click', () => {
      Logger.downloadLogs();
    });

    menu.appendChild(downloadLogsItem);
    document.body.appendChild(menu);
  }

  return menu;
}