import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { ReactNode, createContext, useMemo, useState } from 'react';
import { useBackupContext } from './BackupContext';
import { compareJunctionToBackup } from '../utils';
import { createChangedIds, createMandatoryUseContext } from '@/utils';
import { useSelectedDataModelsContext } from '@/contexts/SelectedDataModelsContext';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { RestoreBigJunctionBackupAction } from '../actions';
import { getBigJunctionTurns } from '@/utils/wme-entities/big-junction-turns';

interface RestoreContextPayload {
  readonly targetBigJunction: BigJunctionDataModel;
  readonly isSameJunction: boolean;
  readonly hasJunctionNewTurns: boolean;
  readonly isBackupRestored: boolean;
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
  const [isBackupRestored, setIsBackupRestored] = useState(false);
  const hasJunctionNewTurns =
    backup &&
    backup.getTurns().length < getBigJunctionTurns(targetBigJunction).length;

  const restoreCurrentBackup = () => {
    const segmentChangedIds = createChangedIds(
      targetBigJunction.model.segments.getObjectArray() as SegmentDataModel[],
      (segment) => segment.getAttribute('id'),
      (segment) => segment.getAttribute('origIDs'),
      (ids) => ids.join(','),
    );
    targetBigJunction.model.actionManager.add(
      new RestoreBigJunctionBackupAction(
        targetBigJunction,
        backup,
        segmentChangedIds,
      ),
    );
    setIsBackupRestored(true);
  };

  return (
    <RestoreContext.Provider
      value={{
        targetBigJunction,
        isSameJunction,
        isBackupRestored,
        hasJunctionNewTurns,
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
