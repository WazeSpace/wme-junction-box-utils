import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { EditPanelTemplate } from '@/components/edit-panel/edit-panel-template';
import { RoundaboutExitInstructionNormalizationButton } from '@/components/edit-panel/roundabout-exit-instruction-normalization/RoundaboutExitInstructionNormalizationButton';
import {
  isSegmentConnectsToRoundabout,
  isSegmentDirectionAllowed,
} from '@/utils/wme-entities/segment';
import { ReactElement } from 'react';

export class RoundaboutExitInstructionNormalizationTemplate
  implements EditPanelTemplate
{
  private readonly _segment: SegmentDataModel;

  constructor(segments: SegmentDataModel[]) {
    this._segment = segments[0];
  }

  static getSupportedElementTypes(): WazeMapEditorEntityType[] {
    return [WazeMapEditorEntityType.Segment];
  }

  getTargetElement(): HTMLElement {
    return document.querySelector(
      '.segment-edit-section #segment-edit-general div:has(wz-button.edit-house-numbers)',
    );
  }

  static isEnabledForElements(segments: SegmentDataModel[]): boolean {
    return segments.length === 1 && isSegmentConnectsToRoundabout(segments[0]);
  }

  render(): ReactElement[] {
    return [
      this.renderForDirection('reverse'), // Node A
      this.renderForDirection('forward'), // Node B
    ];
  }

  renderForDirection(direction: 'forward' | 'reverse'): ReactElement {
    const connectsToRoundabout = isSegmentConnectsToRoundabout(
      this._segment,
      direction,
    );
    const drivable = isSegmentDirectionAllowed(this._segment, direction);
    if (!connectsToRoundabout || !drivable) return null;

    return (
      <RoundaboutExitInstructionNormalizationButton
        segment={this._segment}
        direction={direction}
      />
    );
  }
}
