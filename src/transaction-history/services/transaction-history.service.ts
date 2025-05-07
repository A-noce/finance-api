import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagHistory } from '@tag-history/entity/tag-history.entity';
import { TagHistoryService } from '@tag-history/services/tag-history.service';
import { CreateTransactionHistoryRequestDTO } from '@transaction-history/dtos/create-transaction-history.request.dto';
import { GenerateTransactionHistoryRequestDTO } from '@transaction-history/dtos/generater-transaction-history.request.dto ';
import { TransactionHistory } from '@transaction-history/entity/transaction-history.entity';
import { TransactionTagHistory } from '@transaction-tag-history/entity/transaction-tag-history.entity';
import { TransactionTag } from '@transaction-tag/entity/transaction-tag.entity';
import { Transaction } from '@transaction/entity/transaction.entity';
import { TransactionTypeEnum } from '@typing/enums';
import { UserService } from '@user/services/user.service';
import { eachDayOfInterval, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import { DataSource, EntityManager, IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';

@Injectable()
export class TransactionHistoryService {
  constructor(
    @InjectRepository(TransactionHistory)
    private readonly repository: Repository<TransactionHistory>,
    private readonly tagHistoryService: TagHistoryService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  public async findById(id: number) {
    return await this.repository.findOneBy({ id });
  }

  public async findByParam(param: any) {
    return await this.repository.find(param.buildFilter());
  }

  public async createTransactionHistory(
    dto: CreateTransactionHistoryRequestDTO,
  ) {
    const inputTagList = await this.tagHistoryService.findByTagHistoryId(
      dto.listInputTagId,
    );
    const outputTagList = await this.tagHistoryService.findByTagHistoryId(
      dto.listOutputTagId,
    );
    const user = await this.userService.findById(dto.userId);
    const transactionId = await this.dataSource.transaction(async (manager) => {
      const entity = manager.create(TransactionHistory, { ...dto, user });
      const transactionHistory = await manager.save(entity);
      await this.createTransactionTagHistory(
        transactionHistory,
        manager,
        inputTagList,
        TransactionTypeEnum.INPUT,
      );
      await this.createTransactionTagHistory(
        transactionHistory,
        manager,
        outputTagList,
        TransactionTypeEnum.OUTPUT,
      );
      return transactionHistory.id;
    });
    return await this.findById(transactionId);
  }

  public async updateTransactionHistory(id: number, dto: any) {
    const transactionHistory = this.repository.findOneBy({ id });
    if (!transactionHistory) {
      throw new NotFoundException('TransactionHistory not found');
    }
    const updatedTransactionHistory = Object.assign(transactionHistory, dto);
    return this.repository.save(updatedTransactionHistory);
  }

  private async createTransactionTagHistory(
    transactionHistory: TransactionHistory,
    manager: EntityManager,
    tagList: TagHistory[],
    transactionType: TransactionTypeEnum,
  ) {
    const promiseList = tagList.map((tagHistory) => {
      const payload = manager.create(TransactionTagHistory, {
        transactionHistory,
        tagHistory,
        transactionType,
      });
      return manager.save(payload);
    });
    await Promise.all(promiseList);
  }

  public async createTransactionHistoryFromTransaction(
    transation: Transaction,
  ) {
    const dtoList = this.createTransactionHistoryDTO(transation);
    dtoList.forEach(async (dto) => {
      const inputTagList = await this.tagHistoryService.findByTagHistoryByTagId(
        dto.listInputTagId,
      );
      const outputTagList =
        await this.tagHistoryService.findByTagHistoryByTagId(
          dto.listOutputTagId,
        );
      await this.dataSource.transaction(async (manager) => {
        const entity = manager.create(TransactionHistory, {
          ...dto,
          user: transation.user,
        });
        const transactionHistory = await manager.save(entity);
        await this.createTransactionTagHistory(
          transactionHistory,
          manager,
          inputTagList,
          TransactionTypeEnum.INPUT,
        );
        await this.createTransactionTagHistory(
          transactionHistory,
          manager,
          outputTagList,
          TransactionTypeEnum.OUTPUT,
        );
      });
    });
  }

  public async generateTransactionHistory(dto: GenerateTransactionHistoryRequestDTO) {
    const transactionHistoryWithdate = await this.repository.findOneBy({date: MoreThanOrEqual(dto.date), transaction: Not(IsNull())})
    if(transactionHistoryWithdate) {
      throw new ConflictException(`Process transaction History already ran for ${dto.date}`)
    }
    const transactions = await this.dataSource.getRepository(Transaction).find()
    await Promise.all(transactions.map(this.createTransactionHistoryFromTransaction))
  }

  private createTransactionHistoryDTO(
    transaction: Transaction,
  ): Partial<CreateTransactionHistoryRequestDTO>[] {
    const {
      description,
      title,
      formatedPeriod,
      transactionTag,
      user: { id: userId },
    } = transaction;
    const date = formatedPeriod();
    const { listInputTagId, listOutputTagId } =
      this.getTagHistoryIdFromTransaction(transactionTag);
    const request: CreateTransactionHistoryRequestDTO[] = [];
    if (Array.isArray(date)) {
      const start = startOfMonth(new Date());
      const end = endOfMonth(start);

      const interval = eachDayOfInterval({ start, end });
      interval.forEach((day) => {
        if (date.includes(day.getDay())) {
          request.push({
            title,
            description,
            listInputTagId,
            listOutputTagId,
            date: day.toLocaleDateString(),
            userId,
          });
        }
      });
    } else {
      request.push({
        title,
        description,
        listInputTagId,
        listOutputTagId,
        date,
        userId,
      });
    }
    return request;
  }

  private getTagHistoryIdFromTransaction(transactionTag: TransactionTag[]) {
    const listInputTagId = transactionTag
      .filter(
        ({ transactionType }) => transactionType === TransactionTypeEnum.INPUT,
      )
      .map(({ tag }) => tag.tagHistory.id);
    const listOutputTagId = transactionTag
      .filter(
        ({ transactionType }) => transactionType === TransactionTypeEnum.OUTPUT,
      )
      .map(({ tag }) => tag.tagHistory.id);
    return { listInputTagId, listOutputTagId };
  }
}
