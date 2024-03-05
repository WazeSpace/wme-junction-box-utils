interface Region {
  el?: string;
  regionClass: Function;
}

export default class Layout {
  $el: HTMLElement[];
  cid: string;
  dataModel: any; // todo change the type to data model once it is defined
  editingMediatorBindings: {
    [key: string]: {
      observe: string;
      visible: () => boolean;
    };
  };
  el: HTMLElement;
  events: any[]; // todo inspect this type. currently it is an empty array
  feedControl: any; // todo wait before defining this type, probably more props will be binded to it
  model: import('../App').default;
  mteController: any; // todo wait before defining this type, probably more props will be binded to it
  options: {
    dataModel: any; // todo change the type to data model once it is defined
    el: HTMLElement;
    loginManager: any; // todo change the type to login manager once it is defined
    model: import('../App').default;
  };
  regions: {
    advancedToolsRegion: string;
    dialogRegion: Region;
    feedFilterRegion: string;
    layerSwitcherRegion: string;
    mapDialogRegion: Region & {
      map: import('../Map').default;
    };
    mmodeSwitcherRegion: string;
    overlayButtonsRegion: string;
    sandboxMessageRegion: string;
    sidebarRegion: string;
    streetViewDragHandleRegion: string;
    toolbarRegion: string;
    topbarRegion: string;
  };
}
