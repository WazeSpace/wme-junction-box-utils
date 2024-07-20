import { BigJunctionBackupTemplate } from '@/components/edit-panel/big-junction-backup';
import { ReactNode, createContext, useState } from 'react';
import { BigJunctionBackup } from '../models';
import { createMandatoryUseContext } from '@/utils';

interface BackupContextPayload {
  readonly isBackupAvailable: boolean;
  canStoreMoreBackups(): boolean;
  backup: BigJunctionBackup;
  setBackup(newBackup: BigJunctionBackup): void;
}
interface BackupContextProps {
  children: ReactNode;
  initialBackup?: BigJunctionBackup;
  onBackupChanged?: (newBackup: BigJunctionBackup) => void;
}

const BackupContext = createContext<BackupContextPayload | null>(null);
export function BackupContextProvider({
  children,
  initialBackup = null,
  onBackupChanged,
}: BackupContextProps) {
  const [backup, setBackup] = useState<BigJunctionBackup | null>(initialBackup);

  return (
    <BackupContext.Provider
      value={{
        isBackupAvailable: !!backup,
        canStoreMoreBackups() {
          return BigJunctionBackupTemplate.canStoreMoreBackups();
        },
        get backup() {
          return backup;
        },
        set backup(value) {
          setBackup(value);
          onBackupChanged?.(value);
        },
        setBackup(newBackup) {
          setBackup(newBackup);
          onBackupChanged?.(newBackup);
        },
      }}
    >
      {children}
    </BackupContext.Provider>
  );
}

export const useBackupContext = createMandatoryUseContext(
  BackupContext,
  'BackupContext',
);
