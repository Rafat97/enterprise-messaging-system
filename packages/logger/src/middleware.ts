import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { ulid } from 'ulid';
import { Store, storage } from './store';
import { REQUEST_ID_HEADER, REQUEST_LOG_HEADER_ID } from '@fanout/envs';
@Injectable()
export class LoggerIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const reqId = req?.headers[REQUEST_ID_HEADER] || undefined;
    if (reqId) {
      req.headers[REQUEST_LOG_HEADER_ID] = reqId;
    } else {
      const id = ulid();
      req.headers[REQUEST_LOG_HEADER_ID] = id;
    }

    storage.run(new Store(req), next);
  }
}
