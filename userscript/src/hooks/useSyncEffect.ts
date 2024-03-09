import { EffectCallback, DependencyList, useRef } from 'react';

function compareDependencies(
  a: DependencyList | null | undefined,
  b: DependencyList | null | undefined,
) {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const aItem = a[i];
    const bItem = b[i];
    if (aItem !== bItem) return false;
  }

  return true;
}
export function useSyncEffect(effect: EffectCallback, deps?: DependencyList) {
  const lastDeps = useRef<DependencyList>(null);
  const cleanupFn = useRef<ReturnType<EffectCallback>>(null);

  const shouldExecuteEffect = !compareDependencies(lastDeps.current, deps);

  if (!shouldExecuteEffect) return;

  if (cleanupFn.current) cleanupFn.current();
  cleanupFn.current = effect();
}
