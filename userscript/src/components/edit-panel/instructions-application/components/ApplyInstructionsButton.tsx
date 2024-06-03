import { gtag } from '@/google-analytics';
import { useTranslate } from '@/hooks';
import { InstructionEngine } from '@/roundabout-instruction-engine';
import { TurnInstructionMethod } from '@/roundabout-instruction-engine/methods/turn-instruction-method';
import { WzButton } from '@wazespace/wme-react-components';

interface ApplyInstructionsButtonProps {
  engine: InstructionEngine;
  method: TurnInstructionMethod;
  node: string | null;
  gtagProps?: Record<string, any>;
}
export function ApplyInstructionsButton({
  engine,
  method,
  node,
  gtagProps = {},
}: ApplyInstructionsButtonProps) {
  const t = useTranslate('jb_utils.segment.actions.exit_instructions');

  const handleClick = () => {
    engine.applyInstructionMethod(method);
    gtag('event', 'apply_instructions', {
      method: method.type,
      ...gtagProps,
    });
  };

  return (
    <WzButton onClick={handleClick} size="sm" color="text">
      {node !== null ? t(method.type, { node }) : t(`${method.type}_SHORT`)}
    </WzButton>
  );
}
