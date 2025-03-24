import { AddBigJunctionAction, MultiAction } from '@/@waze/Waze/actions';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { UpdateBigJunctionGeometryToRoundaboutAction } from '@/actions';
import { ConditionalTooltip } from '@/components/ConditionalTooltip';
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

  //! Temporary disabled
  //  The code relies on the delete button to have a deleteFeatures method somewhere in the stateNode
  //  Unfortunately, Waze has changed something, and the delete button no longer has this method
  const recreateBigJunction = null;
  // const recreateBigJunction = () => {
  //   const backup = BigJunctionBackup.fromBigJunction(bigJunction);
  //   const newBigJunctionAction = createAddBigJunctionAction(
  //     bigJunction.getAttribute('geoJSONGeometry'),
  //   );
  //   newBigJunctionAction.__jbuSkipAutoRoundaboutize = true;
  //   const updateBigJunctionGeomAction =
  //     getUpdateBigJunctionGeometryAction(newBigJunctionAction);
  //   const multiAction = new MultiAction([
  //     createDeleteBigJunctionAction(bigJunction),
  //     newBigJunctionAction,
  //     updateBigJunctionGeomAction,
  //     new RestoreBigJunctionBackupAction(
  //       newBigJunctionAction.bigJunction,
  //       backup,
  //       [],
  //     ),
  //   ]);
  //   multiAction.generateDescription = () => {
  //     updateBigJunctionGeomAction.generateDescription();
  //     (multiAction as any)._description = (
  //       updateBigJunctionGeomAction as any
  //     )._description;
  //   };
  //   return multiAction;
  // };

  const handleButtonClick = () => {
    const actionToApply = addBigJunctionAction
      ? getUpdateBigJunctionGeometryAction(addBigJunctionAction)
      : recreateBigJunction();
    getWazeMapEditorWindow().W.model.actionManager.add(actionToApply);
    gtag('event', 'roundaboutize_big_junction');
  };

  const buttonContent = (
    <WzButton
      color="text"
      onClick={handleButtonClick}
      disabled={!addBigJunctionAction && !recreateBigJunction}
    >
      {t('jb_utils.big_junction.actions.clone_roundabout_geom')}
    </WzButton>
  );

  if (!addBigJunctionAction && !recreateBigJunction) {
    return (
      <wz-rich-tooltip>
        <div></div>
        <wz-tooltip-source>
          {buttonContent}
          <wz-tooltip-target />
        </wz-tooltip-source>
        <wz-tooltip-content>
          <div>
            <wz-subhead1>Roundaboutization unavailable</wz-subhead1>
            <wz-body2
              style={{ display: 'block', marginTop: 16, lineHeight: 1.3 }}
            >
              Roundabouzation is temporary unavailable for existing junction
              boxes.
              <br />
              As a workaround, backup the properties and manually re-create the
              junction box.
            </wz-body2>
            <wz-caption
              style={{ display: 'block', marginTop: 8, lineHeight: 1.3 }}
            >
              We're working hard to bring back this option, however, it might
              take a while before we can do so.
            </wz-caption>
          </div>
        </wz-tooltip-content>
      </wz-rich-tooltip>
    );
  }

  return buttonContent;
}
