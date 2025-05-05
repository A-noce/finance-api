import { FindManyOptions, Like } from 'typeorm';
import { TagHistory } from '../entity/tag-history.entity';
import { IsOptional, IsString } from 'class-validator';
import { PaginationParamDTO } from '@shared/dtos/PaginationParam.dto';

export class FindTagHistoryParamsRequestDTO
  extends PaginationParamDTO
{
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
  public buildFilter() {
    const query: FindManyOptions<TagHistory> = {};
    const { name, description } = this;

    if (name) {
      const param: FindManyOptions<TagHistory> = {
        where: {
          name: Like(name),
        },
      };
      Object.assign(query, param);
    }
    if (description) {
      const param: FindManyOptions<TagHistory> = {
        where: {
          description: Like(description),
        },
      };
      Object.assign(query, param);
    }
    Object.assign(query, this.buildPaginationParams());
    return query
  }
}
