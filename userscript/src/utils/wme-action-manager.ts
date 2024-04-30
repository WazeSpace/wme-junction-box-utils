import { Action } from '@/@waze/Waze/actions';
import { getWazeMapEditorWindow } from './get-wme-window';
import { BeforeMethodInvocationInterceptor } from '@/method-interceptor';

/**
 * Executes a function while monitoring the change log for new actions and returns them
 * These actions won't be actually pushed to the editor's change log.
 * @param effect The functionality to execute while monitoring the change log
 * @returns The actions that were needed to be pushed and caught
 */
export function getActionsCreatedInContext(effect: () => void): Action[] {
  const newActions: Action[] = [];

  const methodInterceptor = new BeforeMethodInvocationInterceptor(
    getWazeMapEditorWindow().W.model.actionManager,
    'add',
    (newAction: Action) => {
      newActions.push(newAction);
    },
  );
  methodInterceptor.enable();
  effect();
  methodInterceptor.disable();
  return newActions;
}
