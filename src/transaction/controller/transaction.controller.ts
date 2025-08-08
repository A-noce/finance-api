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
import { CreateTransactionRequestDTO } from '@transaction/dtos/create-transaction.request.dto';
import { FilterTransactionParamsRequestDTO } from '@transaction/dtos/filter-transacrion-params.request.dto';
import { TransactionResponseDTO } from '@transaction/dtos/transaction.response.dto';
import { UpdateTransactiopnRequestDTO } from '@transaction/dtos/update-transaction.request.dto';
import { TransactionService } from '@transaction/services/transaction.service';
import { TransformResponse } from 'src/interceptors/transform-response.interceptor';

@Controller('transaction')
@UseGuards(AuthenticatedGuard)
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post()
  @TransformResponse(TransactionResponseDTO)
  async createTag(@Body() body: CreateTransactionRequestDTO, @Req() request: Request) {
    return this.service.createTransaction(body, request);
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
  async getTagFiltered(@Query() param: FilterTransactionParamsRequestDTO, @Req() request: Request) {
    return this.service.findByParam(param, request);
  }

  @Get(':id')
  @TransformResponse(TransactionResponseDTO)
  async getById(@Param('id') id: number) {
    return this.service.findById(id);
  }
}
