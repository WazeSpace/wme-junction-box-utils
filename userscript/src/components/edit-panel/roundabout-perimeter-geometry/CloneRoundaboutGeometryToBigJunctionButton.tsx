import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { UpdateBigJunctionGeometryToRoundaboutAction } from '@/actions';
import { useTranslate } from '@/hooks';
import { useFindBigJunctionAddAction } from '@/hooks/useFindBigJunctionAddAction';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { WzButton } from '@wazespace/wme-react-components';

interface CloneRoundaboutGeometryToBigJunctionButtonProps {
  bigJunction: BigJunctionDataModel;
}
export function CloneRoundaboutGeometryToBigJunctionButton({
  bigJunction,
}: CloneRoundaboutGeometryToBigJunctionButtonProps) {
  const t = useTranslate();
  const addBigJunctionAction = useFindBigJunctionAddAction(bigJunction);

  const handleButtonClick = () => {
    const dataModel = getWazeMapEditorWindow().W.model;
    const map = getWazeMapEditorWindow().W.map;
    const action = new UpdateBigJunctionGeometryToRoundaboutAction(
      addBigJunctionAction,
      dataModel,
      map,
    );
    dataModel.actionManager.add(action);
  };

  return (
    <WzButton
      color="text"
      disabled={!addBigJunctionAction}
      onClick={handleButtonClick}
    >
      {t('jb_utils.big_junction.actions.clone_roundabout_geom')}
    </WzButton>
  );
}
