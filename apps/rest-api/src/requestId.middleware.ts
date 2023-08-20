import { REQUEST_ID_HEADER } from '@fanout/envs';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { ulid } from 'ulid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = ulid();
    req.headers[REQUEST_ID_HEADER] = id;
    next();
  }
}
