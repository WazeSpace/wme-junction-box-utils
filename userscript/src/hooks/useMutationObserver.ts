import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useEventCallback, useUnmount } from 'usehooks-ts';
import { debounce } from '@/utils';

export function useMutationObserver(
  target: Element | null,
  callback: MutationCallback,
  options: MutationObserverInit,
  debounceDelay?: number,
) {
  const observer = useRef<MutationObserver>();
  const memoizedCallback = useEventCallback(callback);
  
  // Create debounced callback if debounceDelay is provided
  const debouncedCallback = useMemo(() => {
    if (debounceDelay && debounceDelay > 0) {
      return debounce(memoizedCallback, debounceDelay);
    }
    return memoizedCallback;
  }, [memoizedCallback, debounceDelay]);

  const observeTarget = useCallback(() => {
    if (!observer.current) return;
    if (!target) return;
    observer.current.observe(target, options);
  }, [options, target]);
  const disconnectTarget = useCallback(() => {
    if (!observer.current) return;
    observer.current.disconnect();
  }, []);

  useUnmount(disconnectTarget);

  useEffect(() => {
    disconnectTarget();
    observer.current = new MutationObserver(debouncedCallback);
    observeTarget();
  }, [debouncedCallback, disconnectTarget, observeTarget]);
}
