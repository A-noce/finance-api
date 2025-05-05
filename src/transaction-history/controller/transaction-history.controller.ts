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
import { CreateTransactionHistoryRequestDTO } from '@transaction-history/dtos/create-transaction-history.request.dto';
import { TransactionHistoryService } from '@transaction-history/services/transaction-history.service';
import { UpdateTransactiopnRequestDTO } from '@transaction/dtos/update-transaction.request.dto';

@Controller('transaction-history')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly service: TransactionHistoryService) {}

  @Post()
  async createTransactionHistory(@Body() body: CreateTransactionHistoryRequestDTO) {
    return this.service.createTransactionHistory(body);
  }

  @Patch(':id')
  async updateTag(
    @Param('id') id: number,
    @Body() dto: UpdateTransactiopnRequestDTO,
  ) {
    return this.service.updateTransactionHistory(id, dto);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.service.findById(id);
  }
}
