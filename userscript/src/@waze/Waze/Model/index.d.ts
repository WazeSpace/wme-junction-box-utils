import Events from '../EventsRepo';

export default class Model<TAttributes> {
  attributes: TAttributes;
  changed: any; // todo inspect, for me it is null right now
  cidPrefix: string;
  idAttribute: string;
  validationError: any; // todo inspect, for me it is null right now

  bind(event: string, callback: Function, n?: any): void; // todo check what is the "n" argument
  chain(): any; // todo need for invocation or deeper search in order to retrieve the return type
  changedAttribute(e: any): any; // todo probably the argument is an attribute name (string) and the output is some kind of object
  clear(e: any): any; // todo need for proxy invocation or deeper search in order to retrieve the argument and return types
  clone(): Model<TAttributes>;
  destroy(e: any): any; // todo need for proxy invocation or deeper search in order to retrieve the argument and return types
  escape(e: any): any; // todo need for proxy invocation or deeper search in order to retrieve the argument and return types
  fetch(e: any): any; // todo need for proxy invocation or deeper search in order to retrieve the argument and return types
  get(attribute: keyof TAttributes): any;
  has(attribute: keyof TAttributes): boolean;
  initialize(): any; // todo for me it looks like an empty function
  invert(): any; // todo need for proxy invocation or deeper search in order to retrieve the return type
  isEmpty(): boolean;
  isNew(): boolean;
  isValid(e: any): boolean; // todo need for proxy invocation or deeper search in order to retrieve the argument type
  keys(): any; // todo need for proxy invocation or deeper search in order to retrieve the return type
  listenTo(e: any, t: any, r: any): any; // todo need for proxy invocation or deeper search in order to retrive the arguments types
  listenToOnce(e: any, t: any, r: any): any; // todo need for proxy invocation or deeper search in order to retrieve the arguments types
  matches(attributes: TAttributes): boolean; // todo probably this is the correct signature, probably it should check if all attributes are the same
  off(event: string, callback: Function, n?: any): void; // todo check what is the "n" argument
  omit(...something: any[]): any; // todo need for proxy invocation or deeper search in order to retrieve the arguments and return types
  on(event: string, callback: Function, n?: any): void; // todo check what is the "n" argument
  once(event: string, callback: Function, r?: any): void; // todo check what is the "r" argument
  pairs(): any; // todo need for proxy invocation or deeper search in order to retrieve the return type
  parse(e: any, t: any): any; // todo need for proxy invocation or deeper search in order to retrieve the arguments and return types. as far as I see the parse function returns the "e" argument, but I am pretty sure this is not the desired beahavior
  pick(): any; // todo need for proxy invocation or deeper search in order to retrieve the return type
  previous(attribute: keyof TAttributes): any;
  previousAttributes(): TAttributes;
  save(e: any, t: any, r: any): boolean; // todo need for proxy invocation or deeper search in order to retrieve the arguments types
  set(attribute: keyof TAttributes, value: any, r?: any): Model<TAttributes>; // todo need for proxy invocation or deeper search in order to retrieve the "r" argument type (which looks like an an options argument)
  stopListening(e: any, t: any, r: any): Model<TAttributes>; // todo need for proxy invocation or deeper search in order to retrieve the arguments types type
  sync(): any; // todo need for proxy invocation or deeper search in order to retrieve the return type
  toJSON(): any; // todo need for proxy invocation or deeper search in order to retrieve the return type
  trigger(event: string, ...args: any[]): void; // todo need for proxy invocation or deeper search in order to retrieve the arguments types, but probably this is right
  unbind(event: string, callback: Function, n?: any): void; // todo check what is the "n" argument
  unset(attribute: keyof TAttributes, r?: any): any; // todo need for proxy invocation or deeper search in order to retrieve the "r" argument type (which looks like an an options argument), also check the return type
  url(): string;
  values(): any; // todo need for proxy invocation or deeper search in order to retrieve the return type
  _validate(attributes: TAttributes, options: any): any; // todo need for proxy invocation or deeper search in order to retrieve the return type, probably the signature is right
}

export class Object {
  static readonly CLASS_NAME: string;

  arePropertiesEditable(): boolean;
  changeID(newId: number): void;
  clone(): Object;
  getCreatedBy(): number;
  getCreatedOn(): number;
  getID(): number;
  getOldID(): number;
  getPermissions(): number;
  getState(): string;
  getType(): string;
  getUniqueID(): string;
  getUpdatedBy(): number;
  getUpdatedOn(): number;
  getVersion(): any; // todo inspect for me it's null
  isAllowed(permission: number): boolean;
  isDeleteable(): boolean;
  isDeleted(): boolean;
  isGeometryEditable(): boolean;
  isInScope(): boolean;
  isInUse(useData?: {
    keepUnsaved?: boolean;
    keepPersistent?: boolean;
    keepSelected?: boolean;
  }): boolean;
  isInserted(): boolean;
  isNew(): boolean;
  isOutOfScope(): boolean;
  isPersistent(): boolean;
  isSelected(): boolean;
  isSnapped(): boolean;
  isUnchanged(): boolean;
  isUpdated(): boolean;
  merge(object: Object): void;
  setID(newId: number): void;
  setOutOfScope(outOfScope: boolean): void;
  setPersistent(persistent: boolean): void;
  setSelected(selected: boolean): void;
  setSnapped(snapped: boolean): void;
  setState(state: string): void;
  setType(type: string): void;
  setVersion(version: any): void; // todo inspect the type
  wasCreatedBy(userId: number): boolean;
}

interface Attributes {
  empty: boolean;
  lastIssueId: string;
  loading: boolean;
  loadingMore: boolean;
  syncWithMap: boolean;
}

export class FeedModel extends Model<Attributes> {
  changed: { loading: boolean };
  cid: string;
  issues: any; // todo change to issues object type
  _changing: boolean;
  _events: Events;
  _listenId: string;
  _listeners: { [key: string]: any }; // todo inspect the type
  _pending: boolean;
  _previousAttributes: Attributes;

  defaults: Attributes;
  initialize(): void;
  loadMore(): any; // todo need invocation or deeper search to find the return type
  refresh(): Promise<any>; // todo need invocation or deeper search to find the return type
  setPageFromResponse(response: any): void; // todo need proxy invocation or deeper search to find the argument type
  _updateSelf(): any; // todo need invocation or deeper search to find the argument type
}
