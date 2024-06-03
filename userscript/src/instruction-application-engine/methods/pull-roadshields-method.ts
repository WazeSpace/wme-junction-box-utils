import { TurnInstructionMethod } from '@/instruction-application-engine/methods/turn-instruction-method';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { getSegmentByVertex } from '@/utils/location';
import { createTurnGuidance } from '@/utils/wme-entities/turn-guidance';

const prefixes = ['$RS$', 'To $RS$', 'ל$RS$', 'ל-$RS$', 'ל- $RS$', 'ל $RS$'];

function buildPrefixesWithRoadshield(roadshieldContent: string): string[] {
  return prefixes.map((prefix) => prefix.replace('$RS$', roadshieldContent));
}

const pullRoadshieldsMethod: TurnInstructionMethod = {
  type: 'PULL_ROADSHIELDS',
  application: (turns) => {
    const dataModel = getWazeMapEditorWindow().W.model;
    return turns.map((turn) => {
      // if the turn has turn guidance set, then preserve it
      if (turn.getTurnData().hasTurnGuidance()) return turn;

      const toSegment = getSegmentByVertex(dataModel, turn.getToVertex());
      const toSegmentAddress = toSegment.getAddress();
      const toSegmentStreet = toSegmentAddress.getStreet();
      const roadshieldText = toSegmentStreet.getAttribute('signText');
      if (!roadshieldText) return turn;
      const potentialPrefixes = buildPrefixesWithRoadshield(roadshieldText);
      for (const potentialPrefix of potentialPrefixes) {
        if (toSegmentStreet.getName().startsWith(potentialPrefix)) {
          const trimSegmentName = toSegmentStreet
            .getName()
            .substring(potentialPrefix.length);

          const turnData = turn.getTurnData().withTurnGuidance(
            createTurnGuidance({
              roadShields: {
                'RS-0': {
                  type: toSegmentStreet.getAttribute('signType'),
                  text: toSegmentStreet.getAttribute('signText'),
                },
              },
              visualInstruction: `$RS-0${trimSegmentName}`,
              tts: `${toSegmentStreet.getAttribute('signText')}${trimSegmentName}`,
            }),
          );
          return turn.withTurnData(turnData);
        }
      }
    });
  },
};

export default pullRoadshieldsMethod;
