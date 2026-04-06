// src/app/medallia.service.ts
import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedalliaService {
  constructor() { }

  loadMedalliaScript() {
    console.log('START URL_TO_MEDALLIA_EMBED_CODE', env.medalliaJs);

    const script = document.createElement('script');
    script.src = env.medalliaJs; //'URL_TO_MEDALLIA_EMBED_CODE'; // Replace with the actual URL or script source
    script.async = true;
    document.head.appendChild(script);

    console.log('FINISH URL_TO_MEDALLIA_EMBED_CODE', env.medalliaJs);
  }
}
