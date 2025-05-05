import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { ResponseDTO } from '@shared/dtos/ResponseDTO';

class TransformInterceptor<T> implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<T>) {}

  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const fn =
          'toDTO' in this.dto
            ? (this.dto.toDTO as any)
            : (data: any) =>
                plainToInstance(this.dto, data, {
                  excludeExtraneousValues: true,
                });
        const body = Array.isArray(data)
          ? data.map((item) => fn(item))
          : fn(data);
        return new ResponseDTO<T | T[]>().setBody(body);
      }),
    );
  }
}

export function TransformResponse<T>(dto: ClassConstructor<T>) {
  return applyDecorators(UseInterceptors(new TransformInterceptor(dto)));
}
