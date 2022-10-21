import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import logger from '@src/logger/winston.setup';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    if (req.body?.password) {
      req.body.password = 'hashed-password';
    }

    const log = {
      timestamp: new Date(),
      status: (exception as HttpException).getStatus(),
      response,
      request: {
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params,
        query: req.query,
      },
      headers: req.headers,
    };

    logger((exception as HttpException).getStatus(), log);

    // 모든 Error는 이곳에서 최종 return
    res.status((exception as HttpException).getStatus()).json(response);
  }
}
