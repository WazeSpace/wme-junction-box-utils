import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { EditPanelTemplate } from '@/components/edit-panel/edit-panel-template';
import { ExitInstructionsApplication } from './ExitInstructionsApplication';
import { isSegmentDirectionAllowed } from '@/utils/wme-entities/segment';
import { ReactElement } from 'react';

export class InstructionsApplicationTemplate implements EditPanelTemplate {
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
    return segments.length === 1;
  }

  render(): ReactElement[] {
    return [
      this.renderForDirection('reverse'), // Node A
      this.renderForDirection('forward'), // Node B
    ];
  }

  renderForDirection(direction: 'forward' | 'reverse'): ReactElement {
    const drivable = isSegmentDirectionAllowed(this._segment, direction);
    if (!drivable) return null;

    return (
      <ExitInstructionsApplication
        segment={this._segment}
        direction={direction}
      />
    );
  }
}
