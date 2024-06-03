import { TurnData } from '@/@waze/Waze/Model/turn-data';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

const dummyDescartesTurns = {
  '-1f': {
    '-1r': {
      navigable: true,
      instructionOpcode: null,
      lanes: null,
      restrictions: [],
      turnGuidance: {},
    },
  },
};
function createFakeTurnGraph() {
  const window = getWazeMapEditorWindow();
  const TurnGraph = window.require('Waze/Model/Graph/TurnGraph');
  return new TurnGraph(window.W.model.roadGraph);
}

function getTurnGuidancePrototype() {
  const turnGraph = createFakeTurnGraph();
  turnGraph.fromDescartes(dummyDescartesTurns);
  const turn: TurnData = turnGraph.adjacencyList.get('-1f')['-1r'];
  const turnGuidance = turn.getTurnGuidance();
  return Object.getPrototypeOf(turnGuidance).constructor;
}

let TurnGuidance = null;
export function createTurnGuidance(data: any) {
  if (!TurnGuidance) TurnGuidance = getTurnGuidancePrototype();
  return new TurnGuidance(data);
}
