/**
 * Creates a debounced function that delays invoking the provided function until after
 * the specified number of milliseconds have elapsed since the last time it was invoked.
 * 
 * This implementation is tree-shakable and doesn't rely on external libraries like lodash.
 * 
 * @param func The function to debounce
 * @param delay The number of milliseconds to delay
 * @returns A new debounced function
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