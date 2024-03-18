import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { DataModel } from '@/@waze/Waze/DataModels/DataModel';
import { ReactNode } from 'react';

export interface EditPanelTemplateConstructor<
  DM extends DataModel = DataModel,
> {
  new (elements: DM[]): EditPanelTemplate;
  getSupportedElementTypes(): WazeMapEditorEntityType[];
  isEnabledForElements(elements: DM[]): boolean;
}

export interface EditPanelTemplate {
  getTargetElement(): HTMLElement;
  render(): ReactNode;
}
