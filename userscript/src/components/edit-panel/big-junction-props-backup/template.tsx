import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { BigJunctionPropsBackup } from '@/components/edit-panel/big-junction-props-backup/BigJunctionPropsBackup';
import { EditPanelTemplate } from '@/components/edit-panel/edit-panel-template';
import { ReactNode } from 'react';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import {
  BigJunctionBackupStrategy,
  InMemoryBigJunctionBackupStrategy,
} from './backup-strategies';

const BACKUP_STRATEGIES: BigJunctionBackupStrategy[] = [
  new InMemoryBigJunctionBackupStrategy(),
];

export const BigJunctionPropsBackupTemplate = class
  implements EditPanelTemplate
{
  private readonly _bigJunction: BigJunctionDataModel;

  constructor(bigJunctions: BigJunctionDataModel[]) {
    this._bigJunction = bigJunctions[0];
  }

  static getSupportedElementTypes(): WazeMapEditorEntityType[] {
    return [WazeMapEditorEntityType.BigJunction];
  }

  static isEnabledForElements(): boolean {
    return true;
  }

  static getBackupStrategyForAutoBackup() {
    return BACKUP_STRATEGIES[0];
  }

  getTargetElement(): HTMLElement {
    return document.querySelector(
      '#edit-panel .big-junction.sidebar-column .tab-content .form-group .controls.junction-actions',
    );
  }

  render(): ReactNode {
    return (
      <BigJunctionPropsBackup
        bigJunction={this._bigJunction}
        backupStrategies={BACKUP_STRATEGIES}
      />
    );
  }
};
