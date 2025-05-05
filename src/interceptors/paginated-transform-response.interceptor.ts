import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { ResponseDTO } from '@shared/dtos/ResponseDTO';

class PaginatedTransformInterceptor<T> implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<T>) {}

  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((response) => {
        if (Array.isArray(response.data) && 'total' in response) {
          return new ResponseDTO().setBody({
            data: response.data.map((item) =>
              plainToInstance(this.dto, item, { excludeExtraneousValues: true })
            ),
            total: response.total,
          })
        }
      })
    );
  }
}

export function TransformPaginatedResponse<T>(dto: ClassConstructor<T>) {
  return applyDecorators(UseInterceptors(new PaginatedTransformInterceptor(dto)));
}
