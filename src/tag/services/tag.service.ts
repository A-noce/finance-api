import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagHistory } from '@tag-history/entity/tag-history.entity';
import { CreateTagRequestDTO } from '@tag/dtos/create-tag.request.dto';
import { FindTagParamsRequestDTO } from '@tag/dtos/find-tag-params.request.dto';
import { UpdateTagRequestDTO } from '@tag/dtos/update-tag.request.dto';
import { TagEntity } from '@tag/entity/tag.entity';
import { DataSource, FindOptionsWhere, In, Not, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly repository: Repository<TagEntity>,
    private readonly dataSource: DataSource
  ) {}

  public async findById(id: number) {
    return await this.repository.findOneBy({ id });
  }

  public async findByParam(param: FindTagParamsRequestDTO) {
    const [data, total] =  await this.repository.findAndCount(param.buildFilter())
    return {
      data,
      total
    }
  }

  public async createTag(tagDTO: CreateTagRequestDTO) {
    await this.validateTagOptions(tagDTO)
    
    return this.dataSource.transaction(async (manager) => {
      const newTag = manager.create(TagEntity, tagDTO)
      const tag = await manager.save(newTag, { transaction: true})
      const history = manager.create(TagHistory, {...tagDTO, tag})
      await manager.save(history)
      return tag
    })
  }

  public async updateTag(id: number, tagDTO: UpdateTagRequestDTO) {
    await this.validateTagOptions(tagDTO, id)
    const oldTag = await this.repository.findOneBy({id})
    if(!oldTag){
      throw new NotFoundException('TagEntity not found')
    }
    const newTag = Object.assign(oldTag, tagDTO)
    return this.repository.save(newTag);
  }

  public async findTagList(tagIdList: number[]) {
    return this.repository.findBy({ id: In(tagIdList)})
  }

  private async validateTagOptions(tagDTO: CreateTagRequestDTO | UpdateTagRequestDTO, tagId?: number){
    if(!tagDTO.color && !tagDTO.name) return
    const id = tagId ? Not(tagId) : undefined
    const where: FindOptionsWhere<TagEntity>[] = [];
    if (tagDTO.color) where.push({ color: tagDTO.color, id });
    if (tagDTO.name) where.push({ name: tagDTO.name, id });
    const tagsFound = await this.repository.find({
      where,
    });
    if(tagsFound.length){
      const list: string[] = []
      tagsFound.forEach((tag) => {
        list.push(tag.color === tagDTO.color ? 'color' : '')
        list.push(tag.name === tagDTO.name ? 'name' : '')
      })
      throw new ConflictException(`Tag with properties: ${list.filter(Boolean).join(',')} already exists`)    
    }
  }
}
