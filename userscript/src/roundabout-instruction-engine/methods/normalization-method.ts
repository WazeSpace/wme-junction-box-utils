import { Turn, TurnNodes } from '@/@waze/Waze/Model/turn';
import {
  RoundaboutTurnInstructionOpcode,
  TurnInstructionOpcode,
} from '@/@waze/Waze/Model/turn-instruction-opcode.enum';
import { getAbsoluteTurnAngleInDegrees } from '@/utils/wme-entities/turn';
import { TurnInstructionMethod } from './turn-instruction-method';

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

const normalizationMethod: TurnInstructionMethod = {
  type: 'NORMALIZATION',
  application: function (turns: Turn[]) {
    const opcodeHashMap = new Map<TurnInstructionOpcode, string>();
    const hashTurnMap = new Map<string, Turn>();
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
          hashTurnMap.set(
            ambiguousTurnHash,
            ambiguousTurn.withTurnData(
              ambiguousTurn
                .getTurnData()
                .withInstructionOpcode(
                  TurnInstructionOpcode.CountRoundaboutExits,
                ),
            ),
          );
          opcodeHashMap.set(preferredOpcode, null);
          preferredOpcode = TurnInstructionOpcode.CountRoundaboutExits;
        }
      }

      const turnId = turn.fromVertex.getID() + turn.toVertex.getID();
      if (preferredOpcode !== TurnInstructionOpcode.CountRoundaboutExits)
        opcodeHashMap.set(preferredOpcode, turnId);

      hashTurnMap.set(
        turnId,
        turn.withTurnData(
          turn.getTurnData().withInstructionOpcode(preferredOpcode),
        ),
      );
    });

    return Array.from(hashTurnMap.values());
  },
};

export default normalizationMethod;
