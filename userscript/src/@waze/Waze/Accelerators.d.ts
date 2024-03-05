import Events from './EventsRepo';

interface Action {
  changeable: boolean;
  enabled: boolean;
  group: string;
  id: string;
  name: string;
}
interface ActionGroup {
  members: Action[];
}

export class Shortcut {
  altKey: boolean;
  ctrlKey: boolean;
  keyCode: string;
  metaKey: boolean;
  shiftKey: boolean;

  fromEmacsNotaion(emacs: string): Shortcut; // todo probably this is the signature, to be verified
  fromString(str: string): Shortcut; // ? what type of format should be passed to this function
  isEmpty(): boolean;
  toString(): string;
}

export default class Accelerators {
  readonly CLASS_NAME: string;

  Actions: { [key: string]: Action };
  BitToModifier: {};
  BrowserEventToModifier: {
    altKey: string;
    ctrlKey: string;
    metaKey: string;
    shiftKey: string;
  };
  Groups: { [key: string]: ActionGroup };
  ModifierToBrowserEvent: {};
  Modifiers: { C: number; S: number; A: number };
  SpecialKeys: { [key: number]: string };
  events: Events;
  shortcutToAction: {
    [key: string]: Action | { shortcut: Shortcut };
  };
  _futureShortcutsByAction: any; // todo inspect
  _streetViewController: any; // todo inspect (derived from other classes)
}
