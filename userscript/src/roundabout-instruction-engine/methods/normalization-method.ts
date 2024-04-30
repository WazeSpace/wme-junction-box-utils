import { TurnNodes } from '@/@waze/Waze/Model/turn';
import {
  RoundaboutTurnInstructionOpcode,
  TurnInstructionOpcode,
} from '@/@waze/Waze/Model/turn-instruction-opcode.enum';
import { RoundaboutInstructionMethod } from './roundabout-instruction-method-application';
import { getAbsoluteTurnAngleInDegrees } from '@/utils/wme-entities/turn';

function getPreferredInstructionFromAngle(
  angle: number,
): RoundaboutTurnInstructionOpcode {
  if (angle >= 45 && angle < 135) return TurnInstructionOpcode.TurnLeft;
  if (angle >= 135 && angle < 225) return TurnInstructionOpcode.UTurn;
  if (angle >= 225 && angle < 315) return TurnInstructionOpcode.TurnRight;
  return TurnInstructionOpcode.Continue;
}

function getPreferredInstructionFromTurn(
  turn: TurnNodes,
): RoundaboutTurnInstructionOpcode {
  const angle = getAbsoluteTurnAngleInDegrees(turn);
  return getPreferredInstructionFromAngle(angle);
}

const normalizationMethod: RoundaboutInstructionMethod = {
  type: 'NORMALIZATION',
  application: function (turns: TurnNodes[]) {
    const opcodeHashMap = new Map<TurnInstructionOpcode, string>();
    const hashTurnMap = new Map<
      string,
      TurnNodes & { opcode: RoundaboutTurnInstructionOpcode }
    >();
    turns.forEach((turn) => {
      let preferredOpcode = getPreferredInstructionFromTurn(turn);
      if (opcodeHashMap.has(preferredOpcode)) {
        // we're dealing with ambiguous match for a single opcode...
        //  ...which means we can't use this opcode for any of the options...
        //  ...and must instead count the exits.
        const ambiguousTurnHash = opcodeHashMap.get(preferredOpcode);
        if (ambiguousTurnHash) {
          // ambiguous hash is only available if the ambiguous turn wasn't corrected
          // in which case the map will still preserve the opcode was used...
          // ...but will not be tied to any turn anymore
          const ambiguousTurn = hashTurnMap.get(ambiguousTurnHash);
          hashTurnMap.set(ambiguousTurnHash, {
            ...ambiguousTurn,
            opcode: TurnInstructionOpcode.CountRoundaboutExits,
          });
          opcodeHashMap.set(preferredOpcode, null);
          preferredOpcode = TurnInstructionOpcode.CountRoundaboutExits;
        }
      }

      hashTurnMap.set(turn.fromVertex.getID() + turn.toVertex.getID(), {
        ...turn,
        opcode: preferredOpcode,
      });
    });

    return Array.from(hashTurnMap.values());
  },
};

export default normalizationMethod;
