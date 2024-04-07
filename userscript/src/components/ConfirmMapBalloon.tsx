import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { useTranslate } from '@/hooks';
import { Geometry } from '@turf/helpers';
import { WzCheckbox, WzButton } from '@wazespace/wme-react-components';
import { useRef } from 'react';
import { TippyAtMapEntity } from './tippy';

type DecisionButtonClickHandler = (dontShowAgain: boolean) => void;

interface ConfirmMapBalloonProps {
  mapEntity: DataModel<DataModelAttributes & { geoJSONGeometry: Geometry }>;
  title: string;
  details: string;
  confirmButtonText?: string;
  cancelButtonText?: string;

  onConfirmClick: DecisionButtonClickHandler;
  onCancelClick: DecisionButtonClickHandler;
}
export function ConfirmMapBalloon(props: ConfirmMapBalloonProps) {
  const t = useTranslate();
  const dontShowAgainRef = useRef<HTMLInputElement>();

  const {
    mapEntity,
    title,
    details,
    confirmButtonText = t('edit.apply'),
    cancelButtonText = t('edit.cancel'),
    onConfirmClick,
    onCancelClick,
  } = props;

  const createUserResponseHandler = (
    callback: DecisionButtonClickHandler,
    overridenDontShowAgain?: boolean,
  ) => {
    return () =>
      callback(overridenDontShowAgain ?? dontShowAgainRef.current.checked);
  };

  return (
    <TippyAtMapEntity
      entity={mapEntity}
      theme="light"
      trigger="manual"
      appendTo={document.body}
      arrow
      interactive
      showOnCreate
      hideOnClick={false}
      onClickOutside={createUserResponseHandler(onCancelClick, false)}
      ignoreAttributes
    >
      <div className="map-balloon-confirm">
        <wz-h4>{title}</wz-h4>
        <wz-body2>{details}</wz-body2>
        <WzCheckbox
          ref={(instance: any) =>
            (dontShowAgainRef.current = instance?.elementFromRef)
          }
        >
          {t('edit.dont_show_again')}
        </WzCheckbox>
        <div className="controls-container">
          <WzButton
            color="secondary"
            onClick={createUserResponseHandler(onCancelClick)}
          >
            {cancelButtonText}
          </WzButton>
          <WzButton onClick={createUserResponseHandler(onConfirmClick)}>
            {confirmButtonText}
          </WzButton>
        </div>
      </div>
    </TippyAtMapEntity>
  );
}
