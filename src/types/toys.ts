// Type definitions for Toys
// Definitions by: yadomi <github.com/yadomi>

declare module 'toys' {
  import { Readable, Writable, Duplex } from 'stream';

  export function stream(stream: Readable | Writable | Duplex): Promise<void>;
}
