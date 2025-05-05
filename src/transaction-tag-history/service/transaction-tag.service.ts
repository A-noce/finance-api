import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTransactionTagHistoryRequestDTO } from "../dtos/create-transaction-tag-history.request.dto";
import { TransactionTagHistory } from "../entity/transaction-tag-history.entity";

@Injectable()
export class TransactionTagHistoryService {
  constructor(
    @InjectRepository(TransactionTagHistory)
    private readonly repository: Repository<TransactionTagHistory>,
  ) {}

  public async createTransactionTag(dto: CreateTransactionTagHistoryRequestDTO) {
    const newRelation = this.repository.create(dto);
    return this.repository.save(newRelation);
  }
}