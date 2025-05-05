import { JwtAuthGuard } from "@guards/jwt.guard"
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { FindTagHistoryParamsRequestDTO } from "@tag-history/dtos/find-tag-params.request.dto"
import { TagHistoryResponseDTO } from "@tag-history/dtos/tag-history.response.dto"
import { TagHistoryService } from "@tag-history/services/tag-history.service"
import { UpdateTagRequestDTO } from "@tag/dtos/update-tag.request.dto"
import { TransformPaginatedResponse } from "src/interceptors/paginated-transform-response.interceptor"
import { TransformResponse } from "src/interceptors/transform-response.interceptor"

@Controller('tag-history')
export class TagHistoryController {
  constructor(private readonly service: TagHistoryService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @TransformResponse(TagHistoryResponseDTO)
  async updateTag(@Param('id') id: number,@Body() dto: UpdateTagRequestDTO){
    return this.service.updateTag(id, dto)
  }

  @Get('/filter')
  @UseGuards(JwtAuthGuard)
  @TransformPaginatedResponse(TagHistoryResponseDTO)
  async getTagFiltered(@Query() param: FindTagHistoryParamsRequestDTO){
    return this.service.findByParam(param)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @TransformResponse(TagHistoryResponseDTO)
  async getById(@Param('id') id: number){
    return this.service.findById(id)
  }
}
