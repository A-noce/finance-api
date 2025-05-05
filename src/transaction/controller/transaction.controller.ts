import { JwtAuthGuard } from '@guards/jwt.guard';
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
import { CreateTransactionRequestDTO } from '@transaction/dtos/create-transaction.request.dto';
import { FilterTransactionParamsRequestDTO } from '@transaction/dtos/filter-transacrion-params.request.dto';
import { TransactionResponseDTO } from '@transaction/dtos/transaction.response.dto';
import { UpdateTransactiopnRequestDTO } from '@transaction/dtos/update-transaction.request.dto';
import { TransactionService } from '@transaction/services/transaction.service';
import { TransformResponse } from 'src/interceptors/transform-response.interceptor';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post()
  @TransformResponse(TransactionResponseDTO)
  async createTag(@Body() body: CreateTransactionRequestDTO) {
    return this.service.createTransaction(body);
  }

  @Patch(':id')
  @TransformResponse(TransactionResponseDTO)
  async updateTag(
    @Param('id') id: number,
    @Body() dto: UpdateTransactiopnRequestDTO,
  ) {
    return this.service.updateTransaction(id, dto);
  }

  @Get('filter')
  async getTagFiltered(@Query() param: FilterTransactionParamsRequestDTO) {
    return this.service.findByParam(param);
  }

  @Get(':id')
  @TransformResponse(TransactionResponseDTO)
  async getById(@Param('id') id: number) {
    return this.service.findById(id);
  }
}
