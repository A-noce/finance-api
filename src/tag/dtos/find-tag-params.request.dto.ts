import { Between, FindManyOptions, LessThan, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { TagEntity } from '@tag/entity/tag.entity';
import { PaginationParamDTO } from '@shared/dtos/PaginationParam.dto';
import { IsOptional, IsString } from 'class-validator';
import { parseISO } from 'date-fns';

export class FindTagParamsRequestDTO extends PaginationParamDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;

  public buildFilter() {
    const query: FindManyOptions<TagEntity> = {};
    const { name, description, color, startDate, endDate } = this;

    if (name) {
      const param: FindManyOptions<TagEntity> = {
        where: {
          name: Like(name),
        },
      };
      Object.assign(query, param);
    }
    if (description) {
      const param: FindManyOptions<TagEntity> = {
        where: {
          description: Like(description),
        },
      };
      Object.assign(query, param);
    }
    if (color) {
      const param: FindManyOptions<TagEntity> = {
        where: {
          color: Like(color),
        },
      };
      Object.assign(query, param);
    }
    if (startDate && !endDate) {
      const param: FindManyOptions<TagEntity> = {
        where: {
          createdAt: MoreThanOrEqual(parseISO(startDate)),
        },
      };
      Object.assign(query, param);
    }
    if (!startDate && endDate) {
      const param: FindManyOptions<TagEntity> = {
        where: {
          createdAt: LessThanOrEqual(parseISO(endDate)),
        },
      };
      Object.assign(query, param);
    }
    if (startDate && endDate) {
      const param: FindManyOptions<TagEntity> = {
        where: {
          createdAt: Between(parseISO(startDate), parseISO(endDate)),
        },
      };
      Object.assign(query, param);
    }    
    Object.assign(query, this.buildPaginationParams());
    return query;
  }
}
