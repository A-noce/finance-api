import { AuthenticatedGuard } from '@guards/authenaticated.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTransactionHistoryRequestDTO } from '@transaction-history/dtos/create-transaction-history.request.dto';
import { FilterTransactionHistoryParamsRequestDTO } from '@transaction-history/dtos/filter-transacrion-history-params.request.dto';
import { GenerateTransactionHistoryRequestDTO } from '@transaction-history/dtos/generater-transaction-history.request.dto ';
import { TransactionHistoryResponseDTO } from '@transaction-history/dtos/transaction-history.response.dto';
import { TransactionHistoryService } from '@transaction-history/services/transaction-history.service';
import { UpdateTransactiopnRequestDTO } from '@transaction/dtos/update-transaction.request.dto';
import { TransformResponse } from 'src/interceptors/transform-response.interceptor';

@Controller('transaction-history')
@UseGuards(AuthenticatedGuard)
export class TransactionHistoryController {
  constructor(private readonly service: TransactionHistoryService) {}

  @Post()
  @TransformResponse(TransactionHistoryResponseDTO)
  async createTransactionHistory(
    @Body() body: CreateTransactionHistoryRequestDTO,
    @Req() request: Request
  ) {
    return this.service.createTransactionHistory(body, request);
  }

  @Get('filter')
  async getTagFiltered(
    @Query() param: FilterTransactionHistoryParamsRequestDTO,
    @Req() request: Request
  ) {
    return this.service.findByParam(param, request);
  }

  @Post('/generate')
  async genereteTransactionHistory(
    @Body() body: GenerateTransactionHistoryRequestDTO,
  ) {
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
