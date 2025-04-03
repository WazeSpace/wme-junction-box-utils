import { Action, AddBigJunctionAction } from '@/@waze/Waze/actions';
import { isCreateObjectAction } from '@/@waze/Waze/actions/create-object.action';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { DataModel } from '@/@waze/Waze/DataModels/DataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { JunctionDataModel } from '@/@waze/Waze/DataModels/JunctionDataModel';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { extractRoundaboutPerimeterPolygon } from '@/utils/perimeter-geometry-extraction';
import { Polygon } from '@turf/helpers';
import transformScale from '@turf/transform-scale';

export class UpdateBigJunctionGeometryToRoundaboutAction extends Action {
  static DefaultSizeFactor = 1.2;
  shouldSerialize = false;

  private readonly _initialGeometry: Polygon;
  private _geometry: Polygon;

  constructor(
    public addBigJunctionAction: AddBigJunctionAction,
    public dataModel: any,
    public map: any,
    private _sizeFactor = UpdateBigJunctionGeometryToRoundaboutAction.DefaultSizeFactor,
    props?: unknown,
  ) {
    super(props);

    this._initialGeometry =
      addBigJunctionAction.bigJunction.getAttribute('geoJSONGeometry');
  }

  private _getBigJunction(): BigJunctionDataModel {
    return this.addBigJunctionAction.bigJunction;
  }

  private _getBigJunctionSegments(dataModel: any): SegmentDataModel[] {
    return this._getBigJunction().getShortSegments(dataModel);
  }

  private _getJunctionById(id: number): JunctionDataModel {
    const junctionRepository = this.dataModel.getRepository('junction');
    return junctionRepository.getObjectById(id);
  }

  private _getRoundaboutJunction(dataModel: any): JunctionDataModel {
    const [checkSegment, ...segments] = this._getBigJunctionSegments(dataModel);
    const getSegmentJunctionId = (segment: SegmentDataModel) => {
      return segment.getAttribute('junctionID');
    };
    const junctionId = getSegmentJunctionId(checkSegment);
    const compareSegmentJunctionId = (segment: SegmentDataModel) => {
      return getSegmentJunctionId(segment) === junctionId;
    };

    if (!segments.every(compareSegmentJunctionId)) return null;
    return this._getJunctionById(junctionId);
  }

  private _getRoundaboutPerimeterGeometry(dataModel: any): Polygon {
    const junction = this._getRoundaboutJunction(dataModel);
    return extractRoundaboutPerimeterPolygon(junction);
  }

  private _updateBigJunctionGeometry(newGeometry: Polygon) {
    const createObjectAction = this.addBigJunctionAction
      .getSubActions()
      .find(isCreateObjectAction<BigJunctionDataModel>);

    const olGeometry =
      getWazeMapEditorWindow().W.userscripts.toOLGeometry(newGeometry);
    this.addBigJunctionAction.bigJunction.attributes.geometry = olGeometry;
    this.addBigJunctionAction.bigJunction.attributes.geoJSONGeometry =
      newGeometry;

    if (createObjectAction) {
      createObjectAction.attributes.geoJSONGeometry = newGeometry;
    }

    this.dataModel
      .getRepository('bigJunction')
      .trigger('objectschanged', [this._getBigJunction()]);
  }

  getFocusFeatures(): DataModel[] {
    return [this._getBigJunction()];
  }

  getAffectedUniqueIds(): string[] {
    return [this._getBigJunction().getUniqueID()];
  }

  doAction(dataModel: any): boolean {
    this._geometry = transformScale(
      this._getRoundaboutPerimeterGeometry(dataModel),
      this._sizeFactor,
    );
    this._updateBigJunctionGeometry(this._geometry);
    return true;
  }

  undoAction() {
    this._updateBigJunctionGeometry(this._initialGeometry);
  }

  redoAction() {
    this._updateBigJunctionGeometry(this._geometry);
  }

  generateDescription() {
    this._description = getWazeMapEditorWindow().I18n.t(
      'jb_utils.save.changes_log.actions.UpdateBigJunctionGeometryToRoundabout',
    );
  }
}
