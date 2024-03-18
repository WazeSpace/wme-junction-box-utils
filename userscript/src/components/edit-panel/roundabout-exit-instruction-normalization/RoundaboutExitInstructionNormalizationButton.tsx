import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { ConditionalTooltip } from '@/components/ConditionalTooltip';
import { useTranslate } from '@/hooks';
import { RoundaboutNormalizationEngine } from '@/roundabout-normalization-engine';
import { WzButton } from '@wazespace/wme-react-components';
import { useMemo } from 'react';

export interface Props {
  segment: SegmentDataModel;
  direction: 'forward' | 'reverse';
}
export function RoundaboutExitInstructionNormalizationButton(props: Props) {
  const engine = useMemo(() => {
    return new RoundaboutNormalizationEngine(props.segment, props.direction);
  }, [props.direction, props.segment]);
  const t = useTranslate();
  const nodeLabel = props.direction === 'forward' ? 'B' : 'A';
  const buttonLabel = t('jb_utils.segment.actions.roundabout_norm.cta', {
    node: nodeLabel,
  });
  const errorTooltipContent = engine.hasExitInstructionBuildError()
    ? engine.getExitInstructionBuildErrorMessage()
    : null;

  const handleButtonClick = () => {
    engine.applySuggestedTurnInstructions();
  };

  return (
    <ConditionalTooltip
      show={!!errorTooltipContent}
      tooltipContent={errorTooltipContent}
    >
      <WzButton
        disabled={!engine.isBuilt()}
        onClick={handleButtonClick}
        size="sm"
        color="text"
      >
        {buttonLabel}
      </WzButton>
    </ConditionalTooltip>
  );
}
