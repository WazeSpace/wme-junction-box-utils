import { reconcileChangedIds } from './id-change-reconciler';

describe('reconcileChangedIds', () => {
  test('should replace single id with multiple ids', () => {
    const subject = [1, 2, 3, 4];
    const changedIds = [{ oldIds: [1], newIds: [5, 6] }];
    const result = reconcileChangedIds(subject, changedIds);
    expect(result).toEqual([5, 6, 2, 3, 4]);
  });

  test('should replace single id with single id', () => {
    const subject = [1, 2, 3, 4];
    const changedIds = [{ oldIds: [1], newIds: [5] }];
    const result = reconcileChangedIds(subject, changedIds);
    expect(result).toEqual([5, 2, 3, 4]);
  });

  test('should replace multiple ids with multiple ids', () => {
    const subject = [1, 2, 3, 4];
    const changedIds = [{ oldIds: [1, 2], newIds: [5, 6] }];
    const result = reconcileChangedIds(subject, changedIds);
    expect(result).toEqual([5, 6, 3, 4]);
  });

  test('should replace multiple ids with single id', () => {
    const subject = [1, 2, 3, 4];
    const changedIds = [{ oldIds: [1, 2], newIds: [5] }];
    const result = reconcileChangedIds(subject, changedIds);
    expect(result).toEqual([5, 3, 4]);
  });

  test('should ignore non sequential list', () => {
    const subject = [1, 3, 2, 4];
    const changedIds = [{ oldIds: [1, 2], newIds: [5, 6] }];
    const result = reconcileChangedIds(subject, changedIds);
    expect(result).toEqual([1, 3, 2, 4]);
  });
});
