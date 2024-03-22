export const AddBigJunctionAction = class {
  constructor() {
    throw new Error('ADD_BIG_JUNCTION action is not implemented');
  }
};

export function isAddBigJunctionAction(action) {
  return action.actionName === 'ADD_BIG_JUNCTION';
}
