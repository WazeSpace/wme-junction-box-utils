import { ApplyTurnInstructionsFromMapAction } from '@/actions/apply-turn-instructions-from-map.action';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

export class NormalizeRoundaboutExitsAction extends ApplyTurnInstructionsFromMapAction {
  actionName = 'NORMALIZE_ROUNDABOUT_EXITS';

  generateDescription() {
    getWazeMapEditorWindow().I18n.t(
      'jb_utils.save.changes_log.actions.NormalizeRoundaboutExits',
      {
        exitsCount: this.getSubActions().length,
      },
    );
  }
}
