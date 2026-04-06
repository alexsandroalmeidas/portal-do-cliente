import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

export interface IPreloadScriptResult {
  script: string;
  loaded: boolean;
  status: string;
};

@Injectable({ providedIn: 'root' })
export class PreloadScriptResolver implements Resolve<IPreloadScriptResult[]> {
  // Here import all dynamically js file
  private scripts: any = {
    echarts: { loaded: false, src: "assets/lib/echarts.min.js" }
  };
  constructor() { }
  load(...scripts: string[]) {
    const promises = scripts.map(script => this.loadScript(script));
    return Promise.all(promises);
  }
  loadScript(name: string): Promise<IPreloadScriptResult> {
    return new Promise((resolve, reject) => {
      if (this.scripts[name].loaded) {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      } else {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.onload = () => {
          this.scripts[name].loaded = true;
          resolve({ script: name, loaded: true, status: 'Loaded' });
        };
        script.onerror = (error: any) => reject({ script: name, loaded: false, status: 'Loaded Error:' + error.toString() });
        document.head.appendChild(script);
      }
    });
  }

  resolve(route: any, state: any): Promise<IPreloadScriptResult[]> {
    return this.load(...route.routeConfig.data.preloadScripts);
  }
}
