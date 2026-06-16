import {
  Action,
  isAddBigJunctionAction,
} from '@/@waze/Waze/actions';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { BigJunctionBackup } from '@/components/edit-panel/big-junction-backup';
import { restoreBigJunctionBackup } from '@/components/edit-panel/big-junction-backup/utils';
import { ManualMethodInvocationInterceptor } from '@/method-interceptor';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { createDeleteBigJunctionAction } from '@/utils/wme-feature-destroyer';
import { useEffect, useMemo } from 'react';
import { useEventCallback } from 'usehooks-ts';
import { wmeSdk } from '@/utils/wme-sdk';
import { doAsyncMultipleActions } from '@/components/edit-panel/big-junction-backup/utils/do-async-multiple-functions';

function getAllBigJunctions(): BigJunctionDataModel[] {
  return getWazeMapEditorWindow().W.model.bigJunctions.getObjectArray();
}

export function EnlargeBigJunction() {
  const onBeforeActionAdded = useEventCallback(
    (addAction: (action: Action) => void, action: Action) => {
      if (!isAddBigJunctionAction(action)) return addAction(action);

      // find another big junction with all its segments exist in the new big junction
      const newBigJunctionSegIDs = new Set<number>(
        (action as any)
          ._findShortSegments(getWazeMapEditorWindow().W.model)
          .map((segment: SegmentDataModel) => segment.getAttribute('id')),
      );
      const deprecatedBigJunction = getAllBigJunctions().find((bigJunction) => {
        const bigJunctionSegments = bigJunction.getAttribute('segIDs');
        return bigJunctionSegments.every((segID) =>
          newBigJunctionSegIDs.has(segID),
        );
      });
      if (!deprecatedBigJunction || deprecatedBigJunction.state === 'DELETE')
        return addAction(action);

      const deleteBigJunctionAction = createDeleteBigJunctionAction(
        deprecatedBigJunction,
      );
      const bigJunctionSnapshot = BigJunctionBackup.fromBigJunction(
        deprecatedBigJunction,
      );

      action.generateDescription(action.bigJunction.model);
      doAsyncMultipleActions(wmeSdk, async () => {
        // Delete old big junction
        getWazeMapEditorWindow().W.model.actionManager.add(
          deleteBigJunctionAction,
        );

        // Add the new big junction
        getWazeMapEditorWindow().W.model.actionManager.add(action);

        // Restore properties on the new big junction
        await restoreBigJunctionBackup(
          (action as any).bigJunction,
          bigJunctionSnapshot,
          [],
        );
      }, (action as any)._description);
    },
  );

  const beforeActionAddedInterceptor = useMemo(
    () =>
      new ManualMethodInvocationInterceptor(
        getWazeMapEditorWindow().W.model.actionManager,
        'add',
        onBeforeActionAdded,
      ),
    [onBeforeActionAdded],
  );

  useEffect(() => {
    beforeActionAddedInterceptor.enable();
    return () => beforeActionAddedInterceptor.disable();
  }, [beforeActionAddedInterceptor]);

  return null;
}
