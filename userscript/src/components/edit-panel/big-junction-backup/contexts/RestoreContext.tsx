import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { ReactNode, createContext, useMemo, useState, useEffect } from 'react';
import { useBackupContext } from './BackupContext';
import { compareJunctionToBackup, restoreBigJunctionBackup } from '../utils';
import { createChangedIds, createMandatoryUseContext } from '@/utils';
import { useSelectedDataModelsContext } from '@/contexts/SelectedDataModelsContext';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { getBigJunctionTurns } from '@/utils/wme-entities/big-junction-turns';
import { Turn } from '@/@waze/Waze/Model/turn';
import {
  UNVERIFIED_TURN_METADATA_SYMBOL,
  WAS_RESTORED_METADATA_SYMBOL,
} from '../constants/meta-symbols';
import { gtag } from '@/google-analytics';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

interface RestoreContextPayload {
  readonly targetBigJunction: BigJunctionDataModel;
  readonly isSameJunction: boolean;
  readonly hasJunctionNewTurns: boolean;
  readonly isBackupRestored: boolean;
  readonly unverifiedTurns: Turn[];
  restore(): void;
}
interface RestoreContextProps {
  children: ReactNode;
}

const RestoreContext = createContext<RestoreContextPayload | null>(null);
export function RestoreContextProvider(props: RestoreContextProps) {
  const [targetBigJunction] =
    useSelectedDataModelsContext<BigJunctionDataModel>();
  const { backup } = useBackupContext();
  const isSameJunction = useMemo(() => {
    if (!backup) return false;
    return compareJunctionToBackup(targetBigJunction, backup);
  }, [backup, targetBigJunction]);

  const [isBackupRestored, setIsBackupRestored] = useState(() =>
    backup
      ? !!Reflect.getMetadata(WAS_RESTORED_METADATA_SYMBOL, backup)
      : false,
  );

  useEffect(() => {
    const update = () => {
      setIsBackupRestored(
        backup
          ? !!Reflect.getMetadata(WAS_RESTORED_METADATA_SYMBOL, backup)
          : false,
      );
    };

    update();

    const actionManager = getWazeMapEditorWindow().W.model.actionManager;
    actionManager.events.on('afteraction', update);
    actionManager.events.on('afterundo', update);
    actionManager.events.on('afterredo', update);
    actionManager.events.on('afterclearactions', update);

    return () => {
      actionManager.events.off('afteraction', update);
      actionManager.events.off('afterundo', update);
      actionManager.events.off('afterredo', update);
      actionManager.events.off('afterclearactions', update);
    };
  }, [backup]);

  const hasJunctionNewTurns =
    backup &&
    backup.getTurns().length < getBigJunctionTurns(targetBigJunction).length;

  const restoreCurrentBackup = async () => {
    const segmentChangedIds = createChangedIds(
      getWazeMapEditorWindow().W.model.segments.getObjectArray() as SegmentDataModel[],
      (segment) => segment.getAttribute('id'),
      (segment) => segment.getAttribute('origIDs'),
      (ids) => ids.join(','),
    );

    try {
      await restoreBigJunctionBackup(
        targetBigJunction,
        backup,
        segmentChangedIds,
      );
      gtag('event', 'backup_restored', {
        event_category: 'big_junction_backup',
      });
    } catch (error) {
      console.error('Failed to restore backup:', error);
    }
  };

  return (
    <RestoreContext.Provider
      value={{
        targetBigJunction,
        isSameJunction,
        isBackupRestored,
        hasJunctionNewTurns,
        unverifiedTurns: getBigJunctionTurns(targetBigJunction).filter(
          (turn) => {
            if (!turn.isFarTurn()) return false;
            if (
              Reflect.getMetadata(
                UNVERIFIED_TURN_METADATA_SYMBOL,
                turn.getTurnData(),
              ) === true
            ) {
              return true;
            }
            if (isBackupRestored && backup) {
              const turnExistsInBackup = backup
                .getTurns()
                .some((t) => t.getID() === turn.getID());
              return !turnExistsInBackup;
            }
            return false;
          },
        ),
        restore: restoreCurrentBackup,
      }}
    >
      {props.children}
    </RestoreContext.Provider>
  );
}
export const useRestoreContext = createMandatoryUseContext(
  RestoreContext,
  'RestoreContext',
);
