import {
  Action,
  isAddBigJunctionAction,
  MultiAction,
} from '@/@waze/Waze/actions';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { BigJunctionBackup } from '@/components/edit-panel/big-junction-backup';
import { RestoreBigJunctionBackupAction } from '@/components/edit-panel/big-junction-backup/actions';
import { ManualMethodInvocationInterceptor } from '@/method-interceptor';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { createDeleteBigJunctionAction } from '@/utils/wme-feature-destroyer';
import { useEffect, useMemo } from 'react';
import { useEventCallback } from 'usehooks-ts';

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

      const newBigJunctionRestoreAction = new RestoreBigJunctionBackupAction(
        action.bigJunction,
        bigJunctionSnapshot,
        [],
      );

      const multiWrapper = new MultiAction([
        deleteBigJunctionAction,
        action,
        newBigJunctionRestoreAction,
      ]);
      multiWrapper.generateDescription = (model) => {
        action.generateDescription(model);
        (multiWrapper as any)._description = (action as any)._description;
      };

      addAction(multiWrapper);
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
