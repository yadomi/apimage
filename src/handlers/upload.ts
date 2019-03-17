import { Request, ResponseToolkit } from 'hapi';
import { createWriteStream } from 'fs';
import { join } from 'path';
import uuidv4 from 'uuid/v4';
import fileType from 'file-type';
import Boom from 'boom';

import Toys from 'toys';
import { Readable } from 'stream';

const isSupported = (mimetype: string) => ['image/jpeg', 'image/webp', 'image/png'].includes(mimetype);

module.exports = async (request: Request, h: ResponseToolkit) => {
  // @ts-ignore
  const data: Readable = request.payload.data;

  const readStream = await fileType.stream(data);
  if (!readStream || (readStream && !readStream.fileType)) {
    throw Boom.badData();
  }

  if (readStream.fileType && readStream.fileType.mime && !isSupported(readStream.fileType.mime)) {
    throw Boom.unsupportedMediaType();
  }

  const uuid = uuidv4();
  const filepath = join('/tmp', uuid);

  const writeStream = createWriteStream(filepath);
  readStream.pipe(writeStream);
  await Toys.stream(writeStream);

  return {
    uuid,
    createdAt: new Date(),
  };
};
