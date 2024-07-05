import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.debug('Inside intercept!');

    const skipInterceptor = this.reflector.get<boolean>(
      'skipResponseInterceptor',
      context.getHandler(),
    );

    if (skipInterceptor) {
      return next.handle();
    }

    return next.handle().pipe(
      map((res) => ({
        success: true,
        message: res?.message,
        data: res?.data || [],
      })),
    );
  }
}
