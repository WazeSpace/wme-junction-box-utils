import { BeforeMethodInvocationInterceptor } from '@/method-interceptor';
import { getWazeMapEditorWindow } from './get-wme-window';
import { createDescratesErrorResponse } from './wme-descartes';

type LockBase<T extends string = string> = {
  _type: T;
  _precondition?: (lock: LockBase) => boolean;

  code: number | string;
  details?: string;
  suggestion?: string;
  geometry?: {
    coordinates: number[];
    type: 'Point';
  };
  objects?: Array<{
    id: number;
    objectType: string;
  }>;
};
type SoftLock = LockBase<'soft'>;
type HardLock = LockBase<'hard'>;
type AnyLock = SoftLock | HardLock;

let _postFeaturesInterceptor: BeforeMethodInvocationInterceptor;
let _nextLockId = 1;
const _locks = new Map<number, AnyLock>();

function putImmideateSaveErrorResponse(locks: AnyLock[]) {
  if (!locks?.length) return;

  const target = getWazeMapEditorWindow();
  const originalFetch = target.fetch;
  target.fetch = (request: any) => {
    target.fetch = originalFetch;
    return new Promise((resolve) => {
      const hasHardLock = locks.some((lock) => lock._type === 'hard');

      const url = request instanceof URL ? request.toString() : request.url;
      resolve(
        createDescratesErrorResponse(
          url,
          hasHardLock ? 'ERROR' : 'WARNING',
          locks,
        ),
      );
    });
  };
}

function getOrCreatePostFeaturesInterceptor() {
  if (_postFeaturesInterceptor) return _postFeaturesInterceptor;

  const descartesClient = getWazeMapEditorWindow().W.controller.descartesClient;
  _postFeaturesInterceptor = new BeforeMethodInvocationInterceptor(
    descartesClient,
    'postFeatures',
    (_data, ignoreWarnings: boolean) => {
      if (!ignoreWarnings && _locks.size) {
        const allLocks = Array.from(_locks.values());
        const activeLocks = allLocks.filter(
          (lock) => !lock._precondition || lock._precondition(lock),
        );
        if (activeLocks.length) putImmideateSaveErrorResponse(activeLocks);
      }
      return BeforeMethodInvocationInterceptor.CONTINUE_EXECUTION;
    },
  );
  return _postFeaturesInterceptor;
}

export const SaveLock = {
  addSoftLock: (
    lock: Omit<SoftLock, '_type'>,
    precondition?: (lock: SoftLock) => boolean,
  ) => {
    const lockId = _nextLockId++;
    _locks.set(lockId, {
      _type: 'soft',
      _precondition: precondition,
      ...lock,
    });
    getOrCreatePostFeaturesInterceptor().enable();
    return lockId;
  },
  addHardLock: (
    lock: Omit<HardLock, '_type'>,
    precondition?: (lock: HardLock) => boolean,
  ) => {
    const lockId = _nextLockId++;
    _locks.set(lockId, {
      _type: 'hard',
      _precondition: precondition,
      ...lock,
    });
    if (!_locks.size) getOrCreatePostFeaturesInterceptor().disable();
    return lockId;
  },
  removeLock: (lockId: number) => _locks.delete(lockId),
};
