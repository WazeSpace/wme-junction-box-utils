import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import {
  EditPanelTemplate,
  EditPanelTemplateConstructor,
} from '@/components/edit-panel/edit-panel-template';
import { CloneRoundaboutGeometryToBigJunctionButton } from '@/components/edit-panel/roundabout-perimeter-geometry/CloneRoundaboutGeometryToBigJunctionButton';
import React from 'react';

export const RoundaboutPerimeterPolygonTemplate: EditPanelTemplateConstructor<BigJunctionDataModel> = class
  implements EditPanelTemplate
{
  private readonly _bigJunction: BigJunctionDataModel;

  static getSupportedElementTypes(): WazeMapEditorEntityType[] {
    return [WazeMapEditorEntityType.BigJunction];
  }

  static isEnabledForElements(bigJunctions: BigJunctionDataModel[]): boolean {
    return bigJunctions.length === 1 && bigJunctions[0].state === 'INSERT';
  }

  constructor(bigJunctions: BigJunctionDataModel[]) {
    this._bigJunction = bigJunctions[0];
  }

  getTargetElement(): HTMLElement {
    return document.querySelector(
      '#edit-panel .big-junction.sidebar-column .tab-content .form-group .controls.junction-actions',
    );
  }

  render(): React.ReactNode {
    return (
      <CloneRoundaboutGeometryToBigJunctionButton
        bigJunction={this._bigJunction}
      />
    );
  }
};
