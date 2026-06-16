import { DataModel } from '@/@waze/Waze/DataModels/DataModel';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { wmeSdk } from '@/utils/wme-sdk';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useEventCallback } from 'usehooks-ts';

const SelectedDataModelsContext = createContext<DataModel[]>(null);

interface SelectedDataModelsContextProviderProps {
  children: ReactNode;
}
function getSelectedDataModels(): any[] {
  const selection = wmeSdk.Editing.getSelection();
  if (!selection) {
    return [];
  }
  const repository = getWazeMapEditorWindow().W.model.getRepository(
    selection.objectType,
  );
  if (!repository) {
    return [];
  }
  return selection.ids
    .map((id: string | number) => repository.getObjectById(id))
    .filter((obj) => obj != null);
}

export function SelectedDataModelsContextProvider({
  children,
}: SelectedDataModelsContextProviderProps) {
  const [selection, setSelection] = useState<any[]>(() =>
    getSelectedDataModels(),
  );
  const updateSelection = useEventCallback(() => {
    setSelection(getSelectedDataModels());
  });

  useEffect(() => {
    const unsubscribe = wmeSdk.Events.on({
      eventName: 'wme-selection-changed',
      eventHandler: updateSelection,
    });

    return () => {
      unsubscribe();
    };
  }, [updateSelection]);

  return (
    <SelectedDataModelsContext.Provider value={selection}>
      {children}
    </SelectedDataModelsContext.Provider>
  );
}

export function useSelectedDataModelsContext<DM extends DataModel>() {
  return useContext(SelectedDataModelsContext) as DM[];
}
