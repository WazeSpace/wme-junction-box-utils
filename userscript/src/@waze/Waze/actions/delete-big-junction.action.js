export const DeleteBigJunctionAction = class {
  constructor() {
    throw new Error('DELETE_BIG_JUNCTION action is not implemented');
  }
};

export function isDeleteBigJunctionAction(action) {
  return action.getActionName() === 'DELETE_BIG_JUNCTION';
}
