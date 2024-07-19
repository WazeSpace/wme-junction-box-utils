import { EditPanelButton } from '@/components/edit-panel/EditPanelButton';
import { gtag } from '@/google-analytics';
import { useTranslate } from '@/hooks';
import { InstructionEngine } from '@/instruction-application-engine';
import { TurnInstructionMethod } from '@/instruction-application-engine/methods/turn-instruction-method';

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
    <EditPanelButton onClick={handleClick} size="sm" color="text">
      {node !== null ? t(method.type, { node }) : t(`${method.type}_SHORT`)}
    </EditPanelButton>
  );
}
