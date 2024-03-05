import type Accelerators from './Accelerators';
import type Config from './Config';
import UserScripts from './UserScripts';

export default interface Waze {
  Config: Config;
  Rule(): any; // todo inspect this function
  accelerators: Accelerators;
  app: any; // TODO
  changesLogController: any; // TODO
  commands: any; // TODO
  controller: any; // TODO
  editingMediator: any; // TODO
  layerSwitchController: any; // TODO
  loginManager: any; // TODO
  map: any; // TODO
  model: any; // TODO
  prefs: any; // TODO
  reqres: any; // TODO
  saveController: any; // TODO
  selectionManager: any; // TODO
  snapshotManager: any; // TODO
  streetViewController: any; // TODO
  togglerTree: any; // TODO
  vent: any; // TODO
  version: string;
  userscripts: UserScripts;
}
// declare var W: Waze;
