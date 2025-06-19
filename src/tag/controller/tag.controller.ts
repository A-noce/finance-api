import { AuthenticatedGuard } from "@guards/authenaticated.guard"
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { CreateTagRequestDTO } from "@tag/dtos/create-tag.request.dto"
import { FindTagParamsRequestDTO } from "@tag/dtos/find-tag-params.request.dto"
import { TagResponseDTO } from "@tag/dtos/tag.response.dto"
import { UpdateTagRequestDTO } from "@tag/dtos/update-tag.request.dto"
import { TagService } from "@tag/services/tag.service"
import { TransformPaginatedResponse } from "src/interceptors/paginated-transform-response.interceptor"
import { TransformResponse } from "src/interceptors/transform-response.interceptor"

@Controller('tag')
@UseGuards(AuthenticatedGuard)
export class TagController {
  constructor(private readonly service: TagService) {}

  @Post()
  @TransformResponse(TagResponseDTO)
  async createTag(@Body() body: CreateTagRequestDTO){
    return this.service.createTag(body)
  }

  @Patch(':id')
  @TransformResponse(TagResponseDTO)
  async updateTag(@Param('id') id: number,@Body() dto: UpdateTagRequestDTO){
    return this.service.updateTag(id, dto)
  }

  @Get('/filter')
  @TransformPaginatedResponse(TagResponseDTO)
  async getTagFiltered(@Query() param: FindTagParamsRequestDTO){
    return this.service.findByParam(param)
  }

  @Get(':id')
  @TransformResponse(TagResponseDTO)
  async getById(@Param('id') id: number){
    return this.service.findById(id)
  }

}
