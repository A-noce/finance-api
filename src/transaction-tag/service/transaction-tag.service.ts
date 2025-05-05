import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionTag } from "../entity/transaction-tag.entity";
import { Repository } from "typeorm";
import { CreateTransactionTagRequestDTO } from "../dtos/create-transaction-tag.request.dto";

@Injectable()
export class TransactionTagService {
  constructor(
    @InjectRepository(TransactionTag)
    private readonly repository: Repository<TransactionTag>,
  ) {}

  public async createTransactionTag(dto: CreateTransactionTagRequestDTO) {
    const newRelation = this.repository.create(dto);
    return this.repository.save(newRelation);
  }
}