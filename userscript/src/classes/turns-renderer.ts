import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';
import { Vertex } from '@/@waze/Waze/Vertex';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { LineString, lineString } from '@turf/helpers';

function cloneInstance(instance: any, overrideProps: any = {}) {
  const prototype = Object.getPrototypeOf(instance);
  return Object.assign(Object.create(prototype), instance, overrideProps);
}

const getPathTurnsLayerConstructor = (() => {
  let constructor: any = null;
  const getExistingInstance = () => {
    const map = getWazeMapEditorWindow().W.map;
    if (map.pathTurnsLayer) return map.pathTurnsLayer;
    map._showPathLayer();
    const layer = map.pathTurnsLayer;
    map._hidePathLayer();
    return layer;
  };
  const createNewConstructor = () => {
    const pathTurnsLayerInstance = getExistingInstance();
    return pathTurnsLayerInstance.constructor;
  };

  return () => {
    if (constructor) return constructor;
    return (constructor = createNewConstructor());
  };
})();
function createPathTurnsLayer(
  dataModel: any,
  selectionManager: any,
  map: any,
  targetLayer: any,
) {
  const constructor = getPathTurnsLayerConstructor();
  return new constructor(dataModel, selectionManager, map, targetLayer);
}

function shimDataModelTurnGraphEvents(dataModel: any) {
  const shimTurnGraph = cloneInstance(dataModel.getTurnGraph(), {
    on: () => {},
    off: () => {},
  });
  return cloneInstance(dataModel, {
    turnGraph: shimTurnGraph,
    getTurnGraph: () => shimTurnGraph,
  });
}

export class TurnsRenderer {
  private _pathTurnsLayer: any;
  private _dataModel: any;

  constructor(dataModel: any, map: any, targetLayer: any) {
    this._pathTurnsLayer = createPathTurnsLayer(
      shimDataModelTurnGraphEvents(dataModel),
      null,
      map,
      targetLayer,
    );
    this._dataModel = dataModel;
  }

  destroy() {
    this._pathTurnsLayer.destroy();
  }

  [Symbol.dispose]() {
    this.destroy();
  }

  private _getSegmentById(id: number): SegmentDataModel {
    return this._dataModel.segments.getObjectById(id);
  }
  private _getVertexGeometry(vertex: Vertex): LineString {
    const segment = this._getSegmentById(vertex.getSegmentID());
    const geometryCoordinates = [
      ...segment.getAttribute('geoJSONGeometry').coordinates,
    ];
    if (vertex.direction === 'rev') geometryCoordinates.toReversed();
    return lineString(geometryCoordinates).geometry;
  }
  highlightTurn(turn: Turn) {
    this._pathTurnsLayer.highlightPath(turn);
    const fromGeometry = this._getVertexGeometry(turn.fromVertex);
    const toGeometry = this._getVertexGeometry(turn.toVertex);
    this._pathTurnsLayer._userDriveRenderer.drawUserDrives([
      fromGeometry,
      toGeometry,
    ]);
  }
  clearHighlightedTurns() {
    this._pathTurnsLayer.clearHighlightedPaths();
  }
}
