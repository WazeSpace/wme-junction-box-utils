import { Turn } from '@/@waze/Waze/Model/turn';
import { TurnInstructionOpcode } from '@/@waze/Waze/Model/turn-instruction-opcode.enum';
import { RoundaboutInstructionMethod } from '@/roundabout-instruction-engine/methods/roundabout-instruction-method-application';

const deNormalizationMethod: RoundaboutInstructionMethod = {
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
