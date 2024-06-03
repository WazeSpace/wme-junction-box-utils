import { Turn } from '@/@waze/Waze/Model/turn';
import { TurnInstructionOpcode } from '@/@waze/Waze/Model/turn-instruction-opcode.enum';
import { TurnInstructionMethod } from '@/roundabout-instruction-engine/methods/turn-instruction-method';

const deNormalizationMethod: TurnInstructionMethod = {
  type: 'DE_NORMALIZATION',
  application: function (turns: Turn[]) {
    return turns.map((turn) =>
      turn.withTurnData(
        turn
          .getTurnData()
          .withInstructionOpcode(TurnInstructionOpcode.CountRoundaboutExits),
      ),
    );
  },
};

export default deNormalizationMethod;
