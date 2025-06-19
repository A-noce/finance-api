import { AuthenticatedGuard } from "@guards/authenaticated.guard"
import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common"
import { FindTagHistoryParamsRequestDTO } from "@tag-history/dtos/find-tag-params.request.dto"
import { TagHistoryResponseDTO } from "@tag-history/dtos/tag-history.response.dto"
import { TagHistoryService } from "@tag-history/services/tag-history.service"
import { UpdateTagRequestDTO } from "@tag/dtos/update-tag.request.dto"
import { TransformPaginatedResponse } from "src/interceptors/paginated-transform-response.interceptor"
import { TransformResponse } from "src/interceptors/transform-response.interceptor"

@Controller('tag-history')
@UseGuards(AuthenticatedGuard)
export class TagHistoryController {
  constructor(private readonly service: TagHistoryService) {}

  @Patch(':id')
  @TransformResponse(TagHistoryResponseDTO)
  async updateTag(@Param('id') id: number,@Body() dto: UpdateTagRequestDTO){
    return this.service.updateTag(id, dto)
  }

  @Get('/filter')
  @TransformPaginatedResponse(TagHistoryResponseDTO)
  async getTagFiltered(@Query() param: FindTagHistoryParamsRequestDTO){
    return this.service.findByParam(param)
  }

  @Get(':id')
  @TransformResponse(TagHistoryResponseDTO)
  async getById(@Param('id') id: number){
    return this.service.findById(id)
  }
}
