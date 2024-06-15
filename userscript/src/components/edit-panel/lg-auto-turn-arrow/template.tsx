/* eslint-disable react-hooks/rules-of-hooks */
import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { EditPanelTemplate } from '@/components/edit-panel/edit-panel-template';
import { isSegmentConnectsToRoundabout } from '@/utils/wme-entities/segment';
import { ReactElement } from 'react';
import MainComponent from './main';

export class LaneGuidanceAutoTurnArrow implements EditPanelTemplate {
  private readonly _segment: SegmentDataModel;
  private static readonly _targetEl = document.createElement('div');

  constructor(segments: SegmentDataModel[]) {
    this._segment = segments[0];
  }

  static getSupportedElementTypes(): WazeMapEditorEntityType[] {
    return [WazeMapEditorEntityType.Segment];
  }

  getTargetElement(): HTMLElement {
    return LaneGuidanceAutoTurnArrow._targetEl;
  }

  static isEnabledForElements(segments: SegmentDataModel[]): boolean {
    return segments.length === 1 && isSegmentConnectsToRoundabout(segments[0]);
  }

  render(): ReactElement {
    return <MainComponent segment={this._segment} />;
  }
}
