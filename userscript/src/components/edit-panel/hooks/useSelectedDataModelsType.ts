import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { useSelectedDataModelsContext } from '@/contexts/SelectedDataModelsContext';

export function useSelectedDataModelsType(): WazeMapEditorEntityType {
  const selectedModels = useSelectedDataModelsContext();
  const [firstModel, ...restModels] = selectedModels;
  const firstModelType = firstModel?.type;

  if (!restModels.every((model) => model.type === firstModelType)) return null;
  return firstModelType as WazeMapEditorEntityType;
}
