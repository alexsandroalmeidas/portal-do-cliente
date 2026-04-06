// crypto.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  async decrypt(encryptedBase64: string, saltBase64: string, ivBase64: string): Promise<string> {
    const encrypted = this.base64ToArray(encryptedBase64);
    const salt = this.base64ToArray(saltBase64);
    const iv = this.base64ToArray(ivBase64);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode('EDENRED-APIM-KEY'),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 150_000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);

    return this.decoder.decode(decrypted);
  }

  private base64ToArray(base64: string): Uint8Array {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  }
}
