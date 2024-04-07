import { useTranslate } from '@/hooks';
import { WzCheckbox, WzButton } from '@wazespace/wme-react-components';
import { ComponentProps, ComponentType, createElement, useRef } from 'react';
import { TippyProps } from '@tippyjs/react';

type DecisionButtonClickHandler = (dontShowAgain: boolean) => void;

export interface ConfirmBalloonProps {
  title: string;
  details: string;
  confirmButtonText?: string;
  cancelButtonText?: string;

  onConfirmClick: DecisionButtonClickHandler;
  onCancelClick: DecisionButtonClickHandler;
}
interface ConfirmBalloonMetadataProps<TC extends ComponentType<TippyProps>> {
  TippyComponent: TC;
  tippyProps: ComponentProps<TC>;
}

export function ConfirmBalloon<TC extends ComponentType<TippyProps>>(
  props: ConfirmBalloonProps & ConfirmBalloonMetadataProps<TC>,
) {
  const t = useTranslate();
  const dontShowAgainRef = useRef<HTMLInputElement>();

  const {
    TippyComponent,
    tippyProps,
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

  return createElement(
    TippyComponent,
    {
      theme: 'light',
      trigger: 'manual',
      appendTo: document.body,
      arrow: true,
      interactive: true,
      showOnCreate: true,
      hideOnClick: false,
      onClickOutside: createUserResponseHandler(onCancelClick, false),
      ignoreAttributes: true,
      ...tippyProps,
    },
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
    </div>,
  );
}
