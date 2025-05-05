import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { TagHistory } from '../entity/tag-history.entity';
import { FindTagHistoryParamsRequestDTO } from '@tag-history/dtos/find-tag-params.request.dto';
import { UpdateTagHistoryRequestDTO } from '@tag-history/dtos/update-tag-history.request.dto';

@Injectable()
export class TagHistoryService {
  constructor(
    @InjectRepository(TagHistory)
    private readonly repository: Repository<TagHistory>,
  ) {}

  public async findById(id: number) {
    return await this.repository.findOneBy({ id });
  }

  public async findByParam(param: FindTagHistoryParamsRequestDTO) {
    const [data, total] = await this.repository.findAndCount(
      param.buildFilter(),
    );
    return { data, total };
  }

  public async findByTagHistoryId(listIds: number[]) {
    return this.repository.find({
      where: {
        id: In(listIds),
      },
    });
  }

  public async findByTagHistoryByTagId(listIds: number[]) {
    return this.repository.find({
      where: {
        tag: {
          id: In(listIds),
        }
        },
      })
  }

  public async updateTag(id: number, tagDTO: UpdateTagHistoryRequestDTO) {
    await this.validateTagOptions(tagDTO, id);
    const oldTag = await this.repository.findOneBy({ id });
    if (!oldTag) {
      throw new NotFoundException('TagEntity not found');
    }
    const newTag = Object.assign(oldTag, tagDTO);
    return this.repository.save(newTag);
  }

  private async validateTagOptions(
    tagDTO: UpdateTagHistoryRequestDTO,
    tagId: number,
  ) {
    if (!tagDTO.color && !tagDTO.name) return;
    const id = Not(tagId);
    const where: FindOptionsWhere<TagHistory>[] = [];
    if (tagDTO.color) where.push({ color: tagDTO.color, id });
    if (tagDTO.name) where.push({ name: tagDTO.name, id });
    const tagsFound = await this.repository.find({
      where,
    });
    if (tagsFound.length) {
      const list: string[] = [];
      tagsFound.forEach((tag) => {
        list.push(tag.color === tagDTO.color ? 'color' : '');
        list.push(tag.name === tagDTO.name ? 'name' : '');
      });
      throw new ConflictException(
        `Tag with properties: ${list.filter(Boolean).join(',')} already exists`,
      );
    }
  }
}
