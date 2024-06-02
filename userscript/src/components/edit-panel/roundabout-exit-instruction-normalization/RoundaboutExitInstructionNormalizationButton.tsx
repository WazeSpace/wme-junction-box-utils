import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { gtag } from '@/google-analytics';
import { useTranslate } from '@/hooks';
import { RoundaboutInstructionMethod } from '@/roundabout-instruction-engine/methods/roundabout-instruction-method-application';
import { RoundaboutInstructionEngine } from '@/roundabout-instruction-engine/roundabout-instruction-engine';
import styled from '@emotion/styled';
import { WzButton } from '@wazespace/wme-react-components';
import { WzButtonProps } from '@wazespace/wme-react-components/dist/wme-intrinsic-elements-props';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTurnArrowTooltips } from '../hooks/useTurnArrowTooltips';
import { TooltipControl } from './TooltipControl';

const TurnArrowTooltipButtonsRoot = styled('div')({
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
  flexWrap: 'wrap',
});

export interface Props {
  segment: SegmentDataModel;
  direction: 'forward' | 'reverse';
}
export function RoundaboutExitInstructionNormalizationButton(props: Props) {
  const engine = useMemo(() => {
    return new RoundaboutInstructionEngine(
      props.segment.model,
      props.segment,
      props.direction,
    );
  }, [props.direction, props.segment]);
  const t = useTranslate();
  const nodeLabel = props.direction === 'forward' ? 'B' : 'A';

  const turnArrowTooltips = useTurnArrowTooltips();
  const immediateTurnArrowTooltip = useMemo(
    () =>
      turnArrowTooltips.find(
        (turnArrowTooltip) => !turnArrowTooltip.turnArrow.getTurn().isFarTurn(),
      ),
    [turnArrowTooltips],
  );
  const createApplyInstructionMethodCallback = (
    method: RoundaboutInstructionMethod,
    trackingSource: string,
  ) => {
    return () => {
      engine.applyInstructionMethod(method);
      gtag('event', 'apply_instructions', {
        event_category: 'roundabout_instructions',
        method: method.type,
        source: trackingSource,
      });
    };
  };

  const createInsturctionMethodButtons = (
    trackingSource: string,
    buttonProps?: Partial<WzButtonProps>,
    translationSuffix?: string,
  ) =>
    engine.getPopulatedInstructionMethods().map((rim) => (
      <WzButton
        key={rim.type}
        onClick={createApplyInstructionMethodCallback(rim, trackingSource)}
        size="sm"
        color="text"
        {...buttonProps}
      >
        {t(
          `jb_utils.segment.actions.exit_instructions.${rim.type}${translationSuffix || ''}`,
          {
            node: nodeLabel,
          },
        )}
      </WzButton>
    ));

  const turnArrowPortal = immediateTurnArrowTooltip
    ? createPortal(
        <TooltipControl label={t('jb_utils.turn_tooltip.roundabout.title')}>
          <TurnArrowTooltipButtonsRoot>
            {createInsturctionMethodButtons(
              'turn_tooltip',
              {
                color: 'text',
              },
              '_SHORT',
            )}
          </TurnArrowTooltipButtonsRoot>
        </TooltipControl>,
        immediateTurnArrowTooltip.element,
      )
    : null;

  return [...createInsturctionMethodButtons('edit_panel'), turnArrowPortal];
}
