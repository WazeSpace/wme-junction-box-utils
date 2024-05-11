import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { useTranslate } from '@/hooks';
import { RoundaboutInstructionEngine } from '@/roundabout-instruction-engine/roundabout-instruction-engine';
import { WzButton } from '@wazespace/wme-react-components';
import { cloneElement, useMemo } from 'react';
import { useTurnArrowTooltips } from '../hooks/useTurnArrowTooltips';
import { createPortal } from 'react-dom';
import { TooltipControl } from './TooltipControl';
import styled from '@emotion/styled';

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
    const instructionEngine = new RoundaboutInstructionEngine(
      props.segment.model,
      props.segment,
      props.direction,
    );
    instructionEngine.calcTurnsForAvailableInstructionMethods();
    return instructionEngine;
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

  const instructionMethodButtons = engine
    .getPopulatedInstructionMethods()
    .map((rim) => (
      <WzButton
        key={rim.type}
        onClick={() => engine.applyInstructionMethod(rim)}
        size="sm"
        color="text"
      >
        {t(`jb_utils.segment.actions.exit_instructions.${rim.type}`, {
          node: nodeLabel,
        })}
      </WzButton>
    ));

  const turnArrowPortal = immediateTurnArrowTooltip
    ? createPortal(
        <TooltipControl label={t('jb_utils.turn_tooltip.roundabout.title')}>
          <TurnArrowTooltipButtonsRoot>
            {instructionMethodButtons.map((button) =>
              cloneElement(button, {
                color: 'secondary',
                children: t(
                  `jb_utils.segment.actions.exit_instructions.${button.key}_SHORT`,
                ),
              }),
            )}
          </TurnArrowTooltipButtonsRoot>
        </TooltipControl>,
        immediateTurnArrowTooltip.element,
      )
    : null;

  return [...instructionMethodButtons, turnArrowPortal];
}
