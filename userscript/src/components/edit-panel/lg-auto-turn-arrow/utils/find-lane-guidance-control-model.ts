import { getReactFiberNode, getReactFiberState } from '@/utils/react-fiber';
import {
  LaneGuidanceControlModel,
  isLaneGuidanceControlModel,
} from '../models';
import { isLanesControlElement } from './is-lanes-control-element';

export function findLaneGuidanceControlModelByLanesControl(
  lanesControlElement: Element,
): LaneGuidanceControlModel {
  if (!isLanesControlElement(lanesControlElement)) return null;
  const fiber = getReactFiberNode(lanesControlElement);
  const controlModelState = getReactFiberState<LaneGuidanceControlModel>(
    fiber,
    (state) => state.attributes && isLaneGuidanceControlModel(state),
  );
  if (!controlModelState) return null;
  return controlModelState[0];
}
