import { AddBigJunctionAction, MultiAction } from '@/@waze/Waze/actions';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { UpdateBigJunctionGeometryToRoundaboutAction } from '@/actions';
import { BigJunctionBackup } from '@/components/edit-panel/big-junction-backup';
import { RestoreBigJunctionBackupAction } from '@/components/edit-panel/big-junction-backup/actions';
import { gtag } from '@/google-analytics';
import { useTranslate } from '@/hooks';
import { useFindBigJunctionAddAction } from '@/hooks/useFindBigJunctionAddAction';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { createAddBigJunctionAction } from '@/utils/wme-feature-creation';
import { createDeleteBigJunctionAction } from '@/utils/wme-feature-destroyer';
import { WzButton } from '@wazespace/wme-react-components';

interface CloneRoundaboutGeometryToBigJunctionButtonProps {
  bigJunction: BigJunctionDataModel;
}
export function CloneRoundaboutGeometryToBigJunctionButton({
  bigJunction,
}: CloneRoundaboutGeometryToBigJunctionButtonProps) {
  const t = useTranslate();
  const addBigJunctionAction = useFindBigJunctionAddAction(bigJunction);

  const getUpdateBigJunctionGeometryAction = (
    addBigJunctionAction: AddBigJunctionAction,
  ) => {
    const dataModel = getWazeMapEditorWindow().W.model;
    const map = getWazeMapEditorWindow().W.map;
    return new UpdateBigJunctionGeometryToRoundaboutAction(
      addBigJunctionAction,
      dataModel,
      map,
    );
  };

  const recreateBigJunction = () => {
    const backup = BigJunctionBackup.fromBigJunction(bigJunction);
    const newBigJunctionAction = createAddBigJunctionAction(
      bigJunction.getAttribute('geoJSONGeometry'),
    );
    newBigJunctionAction.__jbuSkipAutoRoundaboutize = true;
    const updateBigJunctionGeomAction =
      getUpdateBigJunctionGeometryAction(newBigJunctionAction);
    const multiAction = new MultiAction([
      createDeleteBigJunctionAction(bigJunction),
      newBigJunctionAction,
      updateBigJunctionGeomAction,
      new RestoreBigJunctionBackupAction(
        newBigJunctionAction.bigJunction,
        backup,
        [],
      ),
    ]);
    multiAction.generateDescription = () => {
      updateBigJunctionGeomAction.generateDescription();
      (multiAction as any)._description = (
        updateBigJunctionGeomAction as any
      )._description;
    };
    return multiAction;
  };

  const handleButtonClick = () => {
    const actionToApply = addBigJunctionAction
      ? getUpdateBigJunctionGeometryAction(addBigJunctionAction)
      : recreateBigJunction();
    getWazeMapEditorWindow().W.model.actionManager.add(actionToApply);
    gtag('event', 'roundaboutize_big_junction');
  };

  return (
    <WzButton color="text" onClick={handleButtonClick}>
      {t('jb_utils.big_junction.actions.clone_roundabout_geom')}
    </WzButton>
  );
}
