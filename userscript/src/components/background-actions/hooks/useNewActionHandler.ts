import { Action } from '@/@waze/Waze/actions';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { useEffect, useRef } from 'react';

export function useNewActionHandler(handler: (action: Action) => void): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = ({ action }) => savedHandler.current(action);

    const actionManager = getWazeMapEditorWindow().W.model.actionManager;
    actionManager.events.on('afteraction', listener);

    return () => actionManager.events.off('afteraction', listener);
  }, []);
}
