import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { BackupBigJunctionPropsButton } from '@/components/edit-panel/big-junction-props-backup/components/BackupBigJunctionPropsButton';
import { RestoreBigJunctionPropsButton } from '@/components/edit-panel/big-junction-props-backup/components/RestoreBigJunctionPropsButton';
import { BigJunctionBackupStrategy } from './backup-strategies';
import { BigJunctionBackupContextProvider } from './contexts';

interface BigJunctionPropsBackup {
  bigJunction: BigJunctionDataModel;
  backupStrategies: BigJunctionBackupStrategy[];
}
export function BigJunctionPropsBackup(props: BigJunctionPropsBackup) {
  return (
    <BigJunctionBackupContextProvider backupStrategies={props.backupStrategies}>
      <BackupBigJunctionPropsButton bigJunction={props.bigJunction} />
      <RestoreBigJunctionPropsButton bigJunction={props.bigJunction} />
    </BigJunctionBackupContextProvider>
  );
}
