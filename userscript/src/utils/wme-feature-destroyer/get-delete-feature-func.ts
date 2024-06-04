import { DataModel } from '@/@waze/Waze/DataModels/DataModel';
import { findFiberParentNode, getReactFiberNode } from '@/utils/react-fiber';

type DeleteFeatures = (features: DataModel[]) => void;
let deleteFeaturesFunction: DeleteFeatures = null;

function getDeleteFeaturesBtn(): HTMLElement {
  return document.getElementById('delete-button');
}

export function getDeleteFeatureFunction(): DeleteFeatures {
  const deleteFeaturesBtn = getDeleteFeaturesBtn();
  const btnElementFiber = getReactFiberNode(deleteFeaturesBtn);
  const btnComponentInstance = findFiberParentNode(
    btnElementFiber,
    (fiber) =>
      fiber.stateNode && typeof fiber.stateNode.deleteFeatures === 'function',
  );
  const deleteFeaturesRaw = btnComponentInstance.stateNode.deleteFeatures;
  deleteFeaturesFunction = (features) => {
    const origFeatures = btnComponentInstance.stateNode.features;
    btnComponentInstance.stateNode.features = features;
    deleteFeaturesRaw.call(btnComponentInstance.stateNode);
    btnComponentInstance.stateNode.features = origFeatures;
  };
  return deleteFeaturesFunction;
}
