import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { useTranslate } from '@/hooks';
import { RoundaboutInstructionEngine } from '@/roundabout-instruction-engine/roundabout-instruction-engine';
import { WzButton } from '@wazespace/wme-react-components';
import { useMemo } from 'react';

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

  return engine.getPopulatedInstructionMethods().map((rim) => (
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
}
