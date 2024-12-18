interface WebpackModule {
  id: string;
  loaded: boolean;
  exports: any;
}

type WebpackInternalChunkInit = (
  request: ((moduleId: string) => WebpackModule['exports']) & object,
) => void;

type WebpackModuleInit = (
  this: WebpackModule,
  self: WebpackModule,
  exports: WebpackModule['exports'],
  require: (moduleId: string) => WebpackModule['exports'],
) => void;

type WebpackChunkModules = {
  [moduleId: string]: WebpackModuleInit;
};

export type WebpackChunkEditor = Array<
  [
    chunkId: [id: string],
    modules: WebpackChunkModules,
    initializer?: WebpackInternalChunkInit,
  ]
>;

interface InjectorOptions {
  loadedModulesProp?: string;
  allModulesProp?: string;
}

export class WebpackInjector {
  private readonly chunkEditor: WebpackChunkEditor;
  private readonly loadedModulesProp: string | null = null;
  private readonly allModulesProp: string | null = null;
  private readonly unloadedModules = new Set<string | number>();
  private mitmModule: InjectableModule;

  constructor(chunkEditor: WebpackChunkEditor, options: InjectorOptions) {
    this.chunkEditor = chunkEditor;
    this.loadedModulesProp = options['loadedModulesProp'];
    this.allModulesProp = options['allModulesProp'];
    this.validateConfiguration();
    this.initMitm();
  }

  private validateConfiguration() {
    if (!this.chunkEditor) throw new Error('Chunk Editor is missing');
    if (!this.loadedModulesProp && !this.allModulesProp) {
      throw new Error('loadedModulesProp or allModulesProp must be defined');
    }
  }

  private initMitm() {
    this.mitmModule = new InjectableModule(this.chunkEditor);
    this.mitmModule.inject();
  }

  private getWebpackRequireStatic<T = any>(staticPropertyName: string): T {
    return this.mitmModule.runAsModule((require) => {
      if (!require.hasOwnProperty(staticPropertyName)) return undefined;
      return require[staticPropertyName];
    });
  }

  private getAllModuleInitializers(): Array<
    [moduleId: string, init: WebpackModuleInit]
  > {
    if (!this.allModulesProp) throw new Error('allModulesProp must be defined');
    const allModulesObject: WebpackChunkModules = this.getWebpackRequireStatic(
      this.allModulesProp,
    );

    return Object.entries(allModulesObject);
  }

  private isModuleLoadedById(moduleId: string): boolean {
    // if the module is loaded, then it won't call the init function
    // in addition, the module init receives the module data, which includes a "loaded" prop
    // so, replace the init function with something that validates against this prop
    // if our handler was called, then it wasn't loaded
    // if it wasn't, then it was loaded
    // anyway, in our handler, check the loaded prop

    // we need to replace the module init in the chunk, so we need the allModulesProp for it
    if (!this.allModulesProp) throw new Error('allModulesProp must be defined');

    // next, we step into the module to run the tests
    return this.mitmModule.runAsModule((require) => {
      // store the original init
      const origInit: WebpackModuleInit =
        require[this.allModulesProp][moduleId];
      let wasLoaded: boolean | null = null;

      // replace with a module init that raises an error
      require[this.allModulesProp][moduleId] = function (self: WebpackModule) {
        wasLoaded = self.loaded;
        // eslint-disable-next-line prefer-rest-params
        return origInit.apply(this, arguments);
      };

      // now, inside a try-catch block, try to load the module
      // if it gets loaded without the error thrown, then the module was preloaded
      // otherwise, it wasn't
      try {
        if (this.unloadedModules.has(moduleId)) return false;
        require(moduleId);
        if (wasLoaded === null) return true; // null indicates the init wasn't called, thus it was loaded
        return wasLoaded;
      } finally {
        // always re-set the original init
        require[this.allModulesProp][moduleId] = origInit;
      }
    });
  }

  getModuleById(id: string): WebpackModule['exports'] {
    return this.mitmModule.runAsModule((require) => require(id));
  }

  getAllModules(loadedOnly = false): {
    [moduleId: string]: WebpackModule['exports'];
  } {
    if (loadedOnly) {
      if (this.loadedModulesProp)
        return this.getWebpackRequireStatic(this.loadedModulesProp);

      const allModuleInitializers = this.getAllModuleInitializers();
      return allModuleInitializers.reduce((loadedModules, potentialInit) => {
        const [moduleId] = potentialInit;
        if (this.isModuleLoadedById(moduleId))
          loadedModules[moduleId] = this.getModuleById(moduleId);
        return loadedModules;
      }, {});
    }

    const allModuleInitializers = this.getAllModuleInitializers();
    return Object.fromEntries(
      allModuleInitializers.map(
        ([moduleId]) => [moduleId, this.getModuleById(moduleId)] as const,
      ),
    );
  }

  findModules(
    precondition: (exports: WebpackModule['exports']) => boolean,
    onlyInLoadedModules = false,
  ): { [moduleId: string]: WebpackModule['exports'] } {
    const modules = this.getAllModules(onlyInLoadedModules);
    const modulesAsEntries = Object.entries(modules);
    const filteredModuleEntries = modulesAsEntries.filter(([, exports]) =>
      precondition(exports),
    );
    return Object.fromEntries(filteredModuleEntries);
  }

  findModulesByProperties(
    properties: string[],
    onlyInLoadedModules = false,
  ): {
    [moduleId: string]: WebpackModule['exports'];
  } {
    const condition = (exports: WebpackModule['exports']) => {
      return (
        typeof exports === 'object' &&
        properties.every((prop) => prop in exports)
      );
    };

    return this.findModules(condition, onlyInLoadedModules);
  }
}

class InjectableModule {
  private readonly chunkEditor: WebpackChunkEditor;
  private chunkId: string;
  private moduleRuntimeArgs: Parameters<WebpackInternalChunkInit>;

  constructor(chunkEditor: WebpackChunkEditor) {
    this.chunkEditor = chunkEditor;
  }

  private hasChunkWithId(chunkId: string): boolean {
    return this.chunkEditor.some((chunk) => chunk[0][0] === chunkId);
  }

  private getAvailableChunkId(prefix = 'wbchunkinjector') {
    let i = 1;
    const getCompleteId = () => prefix + i;

    while (this.hasChunkWithId(getCompleteId())) i++;

    return getCompleteId();
  }

  inject() {
    if (this.chunkId) return;
    this.chunkId = this.getAvailableChunkId();
    this.chunkEditor.push([
      [this.chunkId],
      {},
      (...args) => {
        this.moduleRuntimeArgs = args;
      },
    ]);
  }

  runAsModule<T>(fn: (...args: Parameters<WebpackInternalChunkInit>) => T): T {
    if (!this.chunkId) throw new Error('Firstly inject the module');
    return fn(...this.moduleRuntimeArgs);
  }
}
