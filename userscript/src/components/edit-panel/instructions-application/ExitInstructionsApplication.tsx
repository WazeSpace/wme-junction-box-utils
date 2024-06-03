import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { useImmediateTurnTooltip } from '@/components/edit-panel/instructions-application/hooks';
import { useTranslate } from '@/hooks';
import { isSegmentConnectsToBigJunction } from '@/utils/wme-entities/big-junction';
import { isSegmentConnectsToRoundabout } from '@/utils/wme-entities/segment';
import styled from '@emotion/styled';
import { createPortal } from 'react-dom';
import { ApplyInstructionsButton, TooltipControl } from './components';
import { SegmentActionsPortal } from './portals';
import {
  InstructionEngine,
  RoundaboutInstructionEngine,
} from '@/instruction-application-engine';
import { useMemo } from 'react';

function getNodeLabelByDirection(direction: 'forward' | 'reverse'): string {
  switch (direction) {
    case 'forward':
      return 'B';
    case 'reverse':
      return 'A';
  }
}

const TurnArrowTooltipButtonsRoot = styled('div')({
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
  flexWrap: 'wrap',
});

interface ExitInstructionsApplicationProps {
  segment: SegmentDataModel;
  direction: 'forward' | 'reverse';
}
export function ExitInstructionsApplication(
  props: ExitInstructionsApplicationProps,
) {
  const t = useTranslate('jb_utils');
  const isInRoundabout = isSegmentConnectsToRoundabout(
    props.segment,
    props.direction,
  );
  const immediateTurnTooltip = useImmediateTurnTooltip();
  const instructionEngine = useMemo(() => {
    if (isInRoundabout) {
      return new RoundaboutInstructionEngine(
        props.segment.model,
        props.segment,
        props.direction,
      );
    }

    if (
      !isSegmentConnectsToBigJunction(
        props.segment.model,
        props.segment,
        props.direction === 'forward' ? 'fwd' : 'rev',
      )
    )
      return null;

    return new InstructionEngine(
      props.segment.model,
      props.segment,
      props.direction,
      [],
    );
  }, [isInRoundabout, props.direction, props.segment]);
  if (!instructionEngine) return null;

  const instructionMethods = instructionEngine.getAvailableInstructionMethods();
  const node = getNodeLabelByDirection(props.direction);

  return (
    <>
      <SegmentActionsPortal>
        {instructionMethods.map((method) => (
          <ApplyInstructionsButton
            key={method.type}
            engine={instructionEngine}
            method={method}
            node={node}
            gtagProps={{ source: 'edit_panel' }}
          />
        ))}
      </SegmentActionsPortal>

      {isInRoundabout &&
        immediateTurnTooltip?.element &&
        createPortal(
          <TooltipControl label={t('turn_tooltip.roundabout.title')}>
            <TurnArrowTooltipButtonsRoot>
              {instructionMethods.map((method) => (
                <ApplyInstructionsButton
                  key={method.type}
                  engine={instructionEngine}
                  method={method}
                  node={null}
                  gtagProps={{ source: 'turn_tooltip' }}
                />
              ))}
            </TurnArrowTooltipButtonsRoot>
          </TooltipControl>,
          immediateTurnTooltip.element,
        )}
    </>
  );
}
