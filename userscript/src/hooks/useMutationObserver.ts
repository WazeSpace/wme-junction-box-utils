import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useEventCallback, useUnmount } from 'usehooks-ts';
import { debounce } from '@/utils';

/**
 * A React hook that creates and manages a MutationObserver with optional debouncing.
 * 
 * @param target - The DOM element to observe for mutations
 * @param callback - The callback function to execute when mutations are detected
 * @param options - Configuration options for the MutationObserver
 * @param debounceDelay - Optional delay in milliseconds to debounce the callback.
 *                       If provided and > 0, the callback will be debounced to improve
 *                       performance when dealing with rapid DOM mutations.
 *                       If not provided or <= 0, the callback executes immediately (default behavior).
 * 
 * @example
 * // Without debouncing (existing behavior)
 * useMutationObserver(element, callback, { childList: true });
 * 
 * @example
 * // With debouncing for performance optimization
 * useMutationObserver(element, callback, { childList: true }, 150);
 */
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
