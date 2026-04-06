import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable()
export class ScriptService {

  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Append the JS tag to the Document Body.
   * @param renderer The Angular Renderer
   * @param src The path to the script
   * @param async Indicate if script is asyncronous
   * @param defer Indicate if script is defer
   * @returns the script element
   */
  public loadJsScript(src: string, async: boolean = true, defer: boolean = false): HTMLScriptElement {
    const script = this.renderer.createElement('script');
    script.innerHTML = '';
    script.type = 'text/javascript';
    script.src = src;
    script.async = async;
    script.defer = defer;

    this.renderer.appendChild(this.document.body, script);

    return script;
  }

  public loadJsScriptMedallia(
    src: string,
    async: boolean = true,
    defer: boolean = false,
    userName: string = '',
    userId: string = ''): HTMLScriptElement {
    const script = this.renderer.createElement('script');
    script.innerHTML = '';
    script.type = 'text/javascript';
    script.src = src;
    script.async = async;
    script.defer = defer;

    script.onload = () => {
      console.log('Medallia Script loaded');
    };

    this.renderer.appendChild(this.document.head, script);

    return script;
  }
}
