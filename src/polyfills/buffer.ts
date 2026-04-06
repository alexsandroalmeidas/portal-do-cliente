import { Buffer } from 'buffer';

export {};

declare global {
  interface BufferConstructor {
    encodeBase64(data: any): string;
    decodeBase64(data: any): string;
  }
}

Buffer.encodeBase64 = (data: any) => {
  return Buffer.from(data).toString('base64');
};

Buffer.decodeBase64 = (data) => {
  return Buffer.from(data, 'base64').toString('ascii');
};
