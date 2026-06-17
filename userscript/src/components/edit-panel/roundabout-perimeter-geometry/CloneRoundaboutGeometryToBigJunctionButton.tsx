import { AddBigJunctionAction } from '@/@waze/Waze/actions';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { UpdateBigJunctionGeometryToRoundaboutAction } from '@/actions';
import { BigJunctionBackup } from '@/components/edit-panel/big-junction-backup';
import { gtag } from '@/google-analytics';
import { useTranslate } from '@/hooks';
import { useFindBigJunctionAddAction } from '@/hooks/useFindBigJunctionAddAction';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { wmeSdk } from '@/utils/wme-sdk';
import { createAddBigJunctionAction } from '@/utils/wme-feature-creation';
import { WzButton } from '@wazespace/wme-react-components';
import { restoreBigJunctionBackup } from '../big-junction-backup/utils';
import { doAsyncMultipleActions } from '../big-junction-backup/utils/do-async-multiple-functions';

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
    const newBigJunctionAction = createAddBigJunctionAction(
      bigJunction.getAttribute('geoJSONGeometry'),
    );
    newBigJunctionAction.__jbuSkipAutoRoundaboutize = true;

    const updateBigJunctionGeomAction = getUpdateBigJunctionGeometryAction(newBigJunctionAction);
    updateBigJunctionGeomAction.generateDescription();
    const description = (updateBigJunctionGeomAction as any)._description;

    doAsyncMultipleActions(wmeSdk, async () => {
      const backup = BigJunctionBackup.fromBigJunction(bigJunction);

      (wmeSdk.DataModel.BigJunctions as any).deleteBigJunction({
        bigJunctionId: bigJunction.getAttribute('id'),
      });

      const actionManager = getWazeMapEditorWindow().W.model.actionManager;
      actionManager.add(newBigJunctionAction);
      actionManager.add(updateBigJunctionGeomAction);
      await restoreBigJunctionBackup(
        newBigJunctionAction.bigJunction,
        backup,
        [],
        false,
      );
    }, description);
  };

  const handleButtonClick = () => {
    if (addBigJunctionAction) {
      const actionToApply = getUpdateBigJunctionGeometryAction(addBigJunctionAction);
      getWazeMapEditorWindow().W.model.actionManager.add(actionToApply);
    } else {
      recreateBigJunction();
    }
    gtag('event', 'roundaboutize_big_junction');
  };

  const buttonContent = (
    <WzButton
      color="text"
      onClick={handleButtonClick}
    >
      {t('jb_utils.big_junction.actions.clone_roundabout_geom')}
    </WzButton>
  );

  return buttonContent;
}
