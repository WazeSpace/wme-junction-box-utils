/**
 * Creates a debounced function that delays invoking the provided function until after
 * the specified number of milliseconds have elapsed since the last time it was invoked.
 * 
 * This implementation is tree-shakable and doesn't rely on external libraries like lodash.
 * It uses native browser APIs (setTimeout/clearTimeout) for optimal performance and bundle size.
 * 
 * @param func The function to debounce
 * @param delay The number of milliseconds to delay
 * @returns A new debounced function that accepts the same parameters as the original
 * 
 * @example
 * const debouncedSave = debounce((data) => saveToServer(data), 500);
 * 
 * // These calls will be debounced - only the last one will execute after 500ms
 * debouncedSave(data1);
 * debouncedSave(data2);
 * debouncedSave(data3); // Only this call will execute
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}