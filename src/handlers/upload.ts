import { Request, ResponseToolkit } from 'hapi';
import uuidv4 from 'uuid/v4';
import fileType from 'file-type';
import Boom from 'boom';

import { Readable } from 'stream';
import IO from '../helpers/io';

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
  await IO.write(uuid, readStream);

  return {
    uuid,
    createdAt: new Date(),
  };
};
