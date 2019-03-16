import { Request, ResponseToolkit } from 'hapi';

module.exports = (request: Request, h: ResponseToolkit) => {
  console.log(request.params);
  return 'xoxo';
};
