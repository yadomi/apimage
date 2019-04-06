import { createWriteStream, createReadStream } from 'fs';
import Toys from 'toys';
import { join } from 'path';
import { Readable } from 'stream';
import Config from '../config';

export default {
  read: async (uuid: string) => {
    const stream = createReadStream(join(Config.storage.base, uuid));
    const data: any = [];
    stream.on('data', chunk => data.push(chunk));

    await Toys.stream(stream);
    return Buffer.concat(data);
  },
  write: async (uuid: string, stream: Readable) => {
    const filepath = join(Config.storage.base, uuid);

    const writeStream = createWriteStream(filepath);
    stream.pipe(writeStream);
    await Toys.stream(writeStream);
  },
};
