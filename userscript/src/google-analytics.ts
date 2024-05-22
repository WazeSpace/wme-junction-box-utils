import { getWazeMapEditorWindow } from './utils/get-wme-window';

interface GTagScriptProps {
  id: string;
  l?: string;
}

const dataLayerName = `__jbu_dataLayer`;
const gtagName = `__${process.env.SCRIPT_ID}_jbu_gtag`;

const GTAG_BASE_URL = 'https://www.googletagmanager.com/gtag/js';

function constructGtagUrl(options: GTagScriptProps): string {
  const url = new URL(GTAG_BASE_URL);
  Object.entries(options).forEach(([param, value]) =>
    url.searchParams.set(param, value),
  );
  return url.toString();
}

export function addGoogleTagManagerToPage(measurementId: string) {
  const scriptTag = document.createElement('script');
  scriptTag.src = constructGtagUrl({
    id: measurementId,
    l: dataLayerName,
  });
  const window: any = getWazeMapEditorWindow();
  window.document.head.append(scriptTag);
  const dataLayer = (window[dataLayerName] = window[dataLayerName] || []);
  window[gtagName] = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  gtag('js', new Date());
  gtag('set', {
    appName: process.env.SCRIPT_NAME,
    appVersion: process.env.VERSION,
    user_properties: {
      user_rank:
        getWazeMapEditorWindow().W.loginManager.user?.getRank?.() ?? -1,
    },
  });
  gtag('config', measurementId);
}

export function gtag(...args: any[]) {
  const { [gtagName]: gtag } = getWazeMapEditorWindow() as any;
  gtag(...args);
}
