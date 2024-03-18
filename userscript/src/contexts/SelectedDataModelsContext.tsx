import { DataModel } from '@/@waze/Waze/DataModels/DataModel';
import { SelectionChangedEvent } from '@/@waze/Waze/events';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
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
export function SelectedDataModelsContextProvider({
  children,
}: SelectedDataModelsContextProviderProps) {
  const [selection, setSelection] = useState<any[]>([]);
  const selectionChangedCallback = useEventCallback(
    ({ detail }: SelectionChangedEvent) => {
      const objects = detail.selected.map((feature) => feature._wmeObject);
      setSelection(objects);
    },
  );
  useEffect(() => {
    const selectionManager = getWazeMapEditorWindow().W.selectionManager;
    selectionManager.events.on('selectionchanged', selectionChangedCallback);

    return () => {
      selectionManager.events.off('selectionchanged', selectionChangedCallback);
    };
  }, []);

  return (
    <SelectedDataModelsContext.Provider value={selection}>
      {children}
    </SelectedDataModelsContext.Provider>
  );
}

export function useSelectedDataModelsContext<DM extends DataModel>() {
  return useContext(SelectedDataModelsContext) as DM[];
}
