import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { ReactNode, createContext, useMemo, useState } from 'react';
import { useBackupContext } from './BackupContext';
import { compareJunctionToBackup } from '../utils';
import { createChangedIds, createMandatoryUseContext } from '@/utils';
import { useSelectedDataModelsContext } from '@/contexts/SelectedDataModelsContext';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { RestoreBigJunctionBackupAction } from '../actions';
import { getBigJunctionTurns } from '@/utils/wme-entities/big-junction-turns';
import { Turn } from '@/@waze/Waze/Model/turn';
import { UNVERIFIED_TURN_METADATA_SYMBOL } from '../constants/meta-symbols';
import { gtag } from '@/google-analytics';

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
    gtag('event', 'backup_restored', { event_category: 'big_junction_backup' });
  };

  return (
    <RestoreContext.Provider
      value={{
        targetBigJunction,
        isSameJunction,
        isBackupRestored,
        hasJunctionNewTurns,
        unverifiedTurns: getBigJunctionTurns(targetBigJunction).filter(
          (turn) =>
            turn.isFarTurn() &&
            Reflect.getMetadata(
              UNVERIFIED_TURN_METADATA_SYMBOL,
              turn.getTurnData(),
            ) === true,
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
