import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { FindManyOptions } from 'typeorm';

export class PaginationParamDTO {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  skip: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  limit: number;

  @IsOptional()
  order: Record<string, 'asc' | 'desc'>;

  public buildPaginationParams(): Pick<
    FindManyOptions,
    'skip' | 'take' | 'order'
  > {
    return { skip: this.skip, take: this.limit, order: this.order };
  }
}
