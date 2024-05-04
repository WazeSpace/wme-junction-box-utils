/**
 * Find the ids that are now constructing a specific older id that have been merged/split
 * @param targetId The original ID that have been changed
 * @param changeList A list of changes a repository had (key is the original id, while the value is the new ids constructing that original value)
 */
export function findTargetIdByIdChangelist<IDX>(
  targetId: IDX,
  changeList: Map<IDX, IDX[]>,
): IDX[] {
  if (!changeList.has(targetId)) return [targetId];

  const changes = changeList.get(targetId);
  if (!changes) return [targetId];

  const result = changes.flatMap((change) =>
    findTargetIdByIdChangelist(change, changeList),
  );

  // Now we have a list of all the new ids constructing the original id
  // But we might have consecutive duplicates if two ids have been merged into one ([123, 456] -> 789)
  const duplicateFilteredResult: IDX[] = [];
  result.forEach((value) => {
    if (
      duplicateFilteredResult.length &&
      duplicateFilteredResult[duplicateFilteredResult.length - 1] === value
    )
      return;
    duplicateFilteredResult.push(value);
  });

  return duplicateFilteredResult;
}

export function createIdChangelist<T, IDX>(
  objects: ReadonlyArray<T>,
  currentIdExtractor: (item: T) => IDX,
  originalIdsExtractor: (item: T) => IDX[],
): Map<IDX, IDX[]> {
  const map = new Map<IDX, IDX[]>();
  objects.forEach((item) => {
    const originalIds = originalIdsExtractor(item);
    if (!originalIds?.length) return;

    const currentId = currentIdExtractor(item);

    originalIds.forEach((originalId) => {
      if (map.has(originalId)) {
        const ids = map.get(originalId);
        map.set(originalId, ids.concat([currentId]));
        return;
      }

      map.set(originalId, [currentId]);
    });
  });

  return map;
}
