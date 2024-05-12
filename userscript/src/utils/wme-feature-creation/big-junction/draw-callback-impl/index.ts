import getFromDrawer from './drawer';
import getFromToolbar from './toolbar';

const SUPPORTED_GETTERS_BY_RELEVANCE = [getFromDrawer, getFromToolbar];

export default function getBigJunctionDrawCallback() {
  for (const getter of SUPPORTED_GETTERS_BY_RELEVANCE) {
    try {
      return getter();
    } catch {}
  }

  throw new Error(
    'Neither of the provided getters was able to resolve to a BigJunction drawCallback',
  );
}
