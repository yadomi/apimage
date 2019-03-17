import { parse, validate } from '../helpers/query';
import { Request, ResponseToolkit } from 'hapi';
import Boom from 'boom';
import Sharp from 'sharp';
import { has } from 'ramda';
import { join } from 'path';

import type from 'file-type';
import { createReadStream } from 'fs';
import Toys from 'toys';

module.exports = async (request: Request, h: ResponseToolkit) => {
  const { query } = request.params;
  const [uuid, extension = 'png'] = request.params.uuid.split('.');

  const stream = createReadStream(join('/tmp', uuid));
  let buffer: Buffer;
  try {
    const data: any = [];
    stream.on('data', chunk => data.push(chunk));

    await Toys.stream(stream);
    buffer = Buffer.concat(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw Boom.notFound();
    }
    throw Boom.badData();
  }

  const validated = validate(parse(query, extension));
  if (validated.error) throw Boom.badRequest(validated.error.message.replace(/\[|\]/g, '').replace(/"/g, '`'));

  const transformations = validated.value;

  if (has('source', transformations)) {
    const mimetype = type(buffer);
    if (!mimetype) throw Boom.badData();

    return h.response(buffer).type(mimetype.mime);
  }

  const t = Sharp(buffer);

  if (has('x', transformations) || has('y', transformations)) {
    const metadata = await t.metadata();
    const options: Sharp.Region = {
      left: transformations.x || 0,
      top: transformations.y || 0,
      width: transformations.width || metadata.width || 0,
      height: transformations.height || metadata.height || 0,
    };
    t.extract(options);
  }

  if (has('width', transformations) || has('height', transformations)) {
    const options: Sharp.ResizeOptions = {
      width: transformations.width,
      height: transformations.height,
    };

    if (has('fit', transformations)) {
      options.fit = transformations.fit;
    }

    if (has('position', transformations)) {
      options.position = Sharp.gravity[transformations.position || 'center'];
    }

    t.resize(null, null, options);
  }

  if (has('extension', transformations)) {
    const options: Sharp.JpegOptions | Sharp.PngOptions | Sharp.WebpOptions = {};
    if (has('quality', transformations)) {
      options.quality = transformations.quality;
    }
    t[transformations.extension](options);
  }

  const transformed = await t.toBuffer();
  const mimetype = type(transformed);
  if (!mimetype) throw Boom.badData();

  return h.response(transformed).type(mimetype.mime);
};
