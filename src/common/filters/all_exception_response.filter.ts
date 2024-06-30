import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            success: false,
            status,
            message: 'Internal Server Error',
          };

    const errorMessage =
      exception instanceof HttpException
        ? (errorResponse as any).message || (errorResponse as any).error
        : exception.toString();

    const path = httpAdapter.getRequestUrl(ctx.getRequest());
    const method = httpAdapter.getRequestMethod(ctx.getRequest());

    this.logger.error(`${method} ${path} ${status} error: ${exception}`);

    httpAdapter.reply(
      ctx.getResponse(),
      {
        success: false,
        status,
        timeStamp: new Date().toISOString(),
        message: errorMessage,
        path,
      },
      status,
    );
  }
}
