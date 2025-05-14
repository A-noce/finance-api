import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTransactionHistoryRequestDTO } from '@transaction-history/dtos/create-transaction-history.request.dto';
import { FilterTransactionHistoryParamsRequestDTO } from '@transaction-history/dtos/filter-transacrion-history-params.request.dto';
import { GenerateTransactionHistoryRequestDTO } from '@transaction-history/dtos/generater-transaction-history.request.dto ';
import { TransactionHistoryResponseDTO } from '@transaction-history/dtos/transaction-history.response.dto';
import { TransactionHistoryService } from '@transaction-history/services/transaction-history.service';
import { UpdateTransactiopnRequestDTO } from '@transaction/dtos/update-transaction.request.dto';
import { TransformPaginatedResponse } from 'src/interceptors/paginated-transform-response.interceptor';
import { TransformResponse } from 'src/interceptors/transform-response.interceptor';

@Controller('transaction-history')
export class TransactionHistoryController {
  constructor(private readonly service: TransactionHistoryService) {}

  @Post()
  @TransformResponse(TransactionHistoryResponseDTO)
  async createTransactionHistory(@Body() body: CreateTransactionHistoryRequestDTO) {
    return this.service.createTransactionHistory(body);
  }

    @Get('filter')
    async getTagFiltered(@Query() param: FilterTransactionHistoryParamsRequestDTO) {
      return this.service.findByParam(param);
    }

  @Post('/generate')
  async genereteTransactionHistory(@Body() body: GenerateTransactionHistoryRequestDTO) {
    return this.service.generateTransactionHistory(body);
  }

  @Patch(':id')
  @TransformResponse(TransactionHistoryResponseDTO)  
  async updateTag(
    @Param('id') id: number,
    @Body() dto: UpdateTransactiopnRequestDTO,
  ) {
    return this.service.updateTransactionHistory(id, dto);
  }

  @Get(':id')
    @TransformResponse(TransactionHistoryResponseDTO)
  async getById(@Param('id') id: number) {
    return this.service.findById(id);
  }
}
