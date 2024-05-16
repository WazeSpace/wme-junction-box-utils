export interface ChangedIdMapping<IDX = number> {
  oldIds: IDX[];
  newIds: IDX[];
}

export function reconcileChangedIds<IDX = number>(
  originalIds: IDX[],
  changedIds: ChangedIdMapping<IDX>[],
): IDX[] {
  const updatedIds = [...originalIds]; // Spread operator for copy

  for (const mapping of changedIds) {
    const { oldIds, newIds } = mapping;

    // Check if all old IDs exist sequentially in the original list
    if (!isSequential(updatedIds, oldIds)) continue;

    // Update all old IDs with corresponding new IDs
    const oldIdIndex = updatedIds.indexOf(oldIds[0]);
    updatedIds.splice(oldIdIndex, oldIds.length, ...newIds);
  }

  return updatedIds;
}

function isSequential<T>(ids: T[], sublist: T[]): boolean {
  const startIndex = ids.indexOf(sublist[0]);
  return (
    sublist.every((id, index) => id === ids[startIndex + index]) &&
    (startIndex + sublist.length - 1 === ids.length - 1 ||
      ids[startIndex + sublist.length] !== sublist[0])
  );
}

export function createChangedIds<T, IDX = number>(
  list: T[],
  currentIdExtractor: (item: T) => IDX,
  prevIdExtractor: (item: T) => IDX[],
  idHasher: (ids: IDX[]) => string,
): ChangedIdMapping<IDX>[] {
  const concenatedToRawIdMap = new Map<string, IDX[]>();
  const prevToNewMap = new Map<IDX[], IDX[]>();

  list.forEach((item) => {
    const originalIds = prevIdExtractor(item);
    if (!originalIds?.length) return;

    const currentId = currentIdExtractor(item);
    const idHash = idHasher(originalIds);
    const sharedOriginalIds = concenatedToRawIdMap.get(idHash) || originalIds;

    if (prevToNewMap.has(sharedOriginalIds)) {
      const newIds = prevToNewMap.get(sharedOriginalIds);
      prevToNewMap.set(sharedOriginalIds, newIds.concat([currentId]));
    } else prevToNewMap.set(sharedOriginalIds, [currentId]);

    concenatedToRawIdMap.set(idHash, sharedOriginalIds);
  });

  return Array.from(prevToNewMap.entries(), ([entryKey, entryValue]) => ({
    oldIds: entryKey,
    newIds: entryValue,
  }));
}
