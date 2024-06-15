/* eslint-disable react-hooks/rules-of-hooks */
import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { EditPanelTemplate } from '@/components/edit-panel/edit-panel-template';
import {
  isSegmentConnectsToRoundabout,
  isSegmentDirectionAllowed,
} from '@/utils/wme-entities/segment';
import { ReactElement } from 'react';
import { SetTurnArrowsButton } from './components';

export class LaneGuidanceAutoTurnArrow implements EditPanelTemplate {
  private readonly _segment: SegmentDataModel;

  constructor(segments: SegmentDataModel[]) {
    this._segment = segments[0];
  }

  static getSupportedElementTypes(): WazeMapEditorEntityType[] {
    return [WazeMapEditorEntityType.Segment];
  }

  getTargetElement(): HTMLElement {
    return document.createElement('div');
  }

  static isEnabledForElements(segments: SegmentDataModel[]): boolean {
    return segments.length === 1 && isSegmentConnectsToRoundabout(segments[0]);
  }

  render(): ReactElement[] {
    return [
      this.renderForDirection('rev'), // Node A
      this.renderForDirection('fwd'), // Node B
    ];
  }

  renderForDirection(direction: 'fwd' | 'rev'): ReactElement {
    const fullDirection = (
      {
        fwd: 'forward',
        rev: 'reverse',
      } as const
    )[direction];

    if (!isSegmentDirectionAllowed(this._segment, fullDirection)) return null;
    if (!isSegmentConnectsToRoundabout(this._segment, fullDirection))
      return null;
    return <SetTurnArrowsButton lanesDirection={direction} />;
  }
}
