import { ReactNode, createContext, useContext, useReducer } from 'react';
import { BigJunctionBackupStrategy } from '../backup-strategies/big-junction-backup-strategy';
import { BigJunctionBackupSnapshot } from '../backup-snapshot';

export interface BigJunctionBackupContextData {
  get(): BigJunctionBackupSnapshot;
  set(backup: BigJunctionBackupSnapshot): void;
}
const BigJunctionBackupContext =
  createContext<BigJunctionBackupContextData>(null);

export interface BigJunctionBackupContextProviderProps {
  children: ReactNode;
  backupStrategies: BigJunctionBackupStrategy[];
}
export function BigJunctionBackupContextProvider({
  children,
  backupStrategies,
}: BigJunctionBackupContextProviderProps) {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const suitableStrategy = backupStrategies[0];
  const backupContextImpl: BigJunctionBackupContextData = {
    get: () => suitableStrategy.getSnapshot(),
    set: (snapshot) => {
      suitableStrategy.saveSnapshot(snapshot);
      forceUpdate();
    },
  };

  return (
    <BigJunctionBackupContext.Provider value={backupContextImpl}>
      {children}
    </BigJunctionBackupContext.Provider>
  );
}

export function useBigJunctionBackupContext() {
  const backupContext = useContext(BigJunctionBackupContext);
  if (!backupContext) {
    throw new Error(
      'useBigJunctionBackupContext can only be used with the Provider',
    );
  }
  return backupContext;
}
