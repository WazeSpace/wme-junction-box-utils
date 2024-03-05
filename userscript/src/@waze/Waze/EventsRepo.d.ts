interface EventHandler<T> {
  callback: Function;
  context: any; // todo inspect
  ctx: T;
  listening: any; // todo inspect
}

export default class Events {
  dispatcher: {
    bind(e: any, t: any, n: any): any; // todo inspect this function
    listenTo(e: any, t: any, r: any): any; // todo inspect this function
    listenToOnce(e: any, t: any, r: any): any; // todo inspect this function
    off(event: string, callback: Function, n?: any): void; // todo inspect n parameter in this function
    on(event: string, callback: Function, n?: any): void; // todo inspect n parameter in this function
    once(event: string, callback: Function, r?: any): void; // todo inspect r parameter in this function
    stopListening(e: any, t: any, r: any): any; // todo inspect this function
    trigger(e: any): any; // todo inspect this function
    unbind(e: any, t: any, n: any): any; // todo inspect this function
    _events: { [key: string]: EventHandler<Events>[] };
  };

  get listeners(): { [key: string]: EventHandler<Events>[] };

  off(event: string, callback: Function, n?: any): void; // todo inspect n parameter in this function
  on(event: string, callback: Function, n?: any): void; // todo inspect n parameter in this function
  register(e: any, t: any, n: any): any; // todo inspect this function
  trigger(e: any): any; // todo inspect this function
  triggerEvent(event: string, data: any): any; // todo probably this is the signature, to be verified
  un(event: string): any; // todo probably this should remove all event listeners, to be verifed
  unregister(e: any, t: any, n: any): any; // todo inspect this function
}
