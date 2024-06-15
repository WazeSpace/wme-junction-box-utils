import { useMutationObserver } from './useMutationObserver';

export function useOnRemove(element: Element, callback: () => void) {
  useMutationObserver(
    element?.parentElement,
    (mutations, observer) => {
      for (const mutation of mutations) {
        const removedNodes = Array.from(mutation.removedNodes);
        for (const el of removedNodes) {
          if (el === element) {
            callback();
            observer.disconnect();
          }
        }
      }
    },
    { childList: true },
  );
}
