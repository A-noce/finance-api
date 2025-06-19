import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDTO } from '@shared/dtos/ResponseDTO';
import { TagHistory } from '@tag-history/entity/tag-history.entity';
import { TagHistoryService } from '@tag-history/services/tag-history.service';
import { CreateTransactionHistoryRequestDTO } from '@transaction-history/dtos/create-transaction-history.request.dto';
import { FilterTransactionHistoryParamsRequestDTO } from '@transaction-history/dtos/filter-transacrion-history-params.request.dto';
import { GenerateTransactionHistoryRequestDTO } from '@transaction-history/dtos/generater-transaction-history.request.dto ';
import { TransactionHistoryResponseDTO } from '@transaction-history/dtos/transaction-history.response.dto';
import { TransactionHistory } from '@transaction-history/entity/transaction-history.entity';
import { TransactionTagHistory } from '@transaction-tag-history/entity/transaction-tag-history.entity';
import { TransactionTag } from '@transaction-tag/entity/transaction-tag.entity';
import { Transaction } from '@transaction/entity/transaction.entity';
import { TransactionTypeEnum } from '@typing/enums';
import { User } from '@user/entity/user.entity';
import { UserService } from '@user/services/user.service';
import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns';
import {
  DataSource,
  EntityManager,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';

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
    return await this.repository.findOne({
      relations: ['transactionTag', 'transactionTag.tagHistory'],
      where: { id },
    });
  }

  public async findByParam(
    param: FilterTransactionHistoryParamsRequestDTO,
    request: Request,
  ) {
    const loggedUser: User = request['user'];
    const [data, total] = await this.buildQuery(
      param,
      loggedUser.id,
    ).getManyAndCount();
    return new ResponseDTO().setBody({
      data: data.map((t) => TransactionHistoryResponseDTO.toDTO(t, param.tag)),
      total,
    });
  }

  public async createTransactionHistory(
    dto: CreateTransactionHistoryRequestDTO,
    request: Request,
  ) {
    const loggedUser: User = request['user'];
    const inputTagList = await this.tagHistoryService.findByTagHistoryId(
      dto.listInputTagId,
    );
    const outputTagList = await this.tagHistoryService.findByTagHistoryId(
      dto.listOutputTagId,
    );
    const user = await this.userService.findById(loggedUser.id);
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

  private async createTransactionHistoryFromTransaction(
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

  public async generateTransactionHistory(
    dto: GenerateTransactionHistoryRequestDTO,
  ) {
    const transactionHistoryWithdate = await this.repository.findOne({
      where: {
        date: MoreThanOrEqual(dto.date),
        transaction: { id: dto?.transactionId },
      },
      relations: ['transaction'],
    });
    if (transactionHistoryWithdate) {
      throw new ConflictException(
        `Process transaction History already ran for ${dto.date}`,
      );
    }
    let transactions: Transaction[] = [];
    const transactionRepository = this.dataSource.getRepository(Transaction);
    const relations = [
      'user',
      'transactionTag',
      'transactionTag.tag',
      'transactionTag.tag.tagHistory',
    ];
    if (!dto.transactionId) {
      transactions = await transactionRepository.find({ relations });
    } else {
      transactions = await transactionRepository.find({
        where: { id: dto.transactionId },
        relations,
      });
    }
    await Promise.all(
      transactions.map((t) => this.createTransactionHistoryFromTransaction(t)),
    );
  }

  private createTransactionHistoryDTO(
    transaction: Transaction,
  ): Partial<CreateTransactionHistoryRequestDTO & { userId: number }>[] {
    const {
      description,
      title,
      transactionTag,
      user: { id: userId },
      value,
    } = transaction;
    const date = transaction.formatedPeriod();
    const { listInputTagId, listOutputTagId } =
      this.getTagHistoryIdFromTransaction(transactionTag);
    const request: (CreateTransactionHistoryRequestDTO & { userId: number })[] =
      [];
    if (Array.isArray(date)) {
      const start = startOfMonth(new Date());
      const end = endOfMonth(start);

      const interval = eachDayOfInterval({ start, end });
      interval.forEach((day) => {
        if (date.includes(day.getDay())) {
          request.push({
            title,
            description,
            value,
            listInputTagId,
            listOutputTagId,
            date: day.toLocaleDateString(),
            userId,
            transaction,
          });
        }
      });
    } else {
      request.push({
        title,
        description,
        value,
        listInputTagId,
        listOutputTagId,
        date,
        userId,
        transaction,
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

  private buildQuery(
    dto: FilterTransactionHistoryParamsRequestDTO,
    userId: number,
  ) {
    const query = this.repository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.transactionTag', 'transactionTagFilter')
      .leftJoin('transactionTagFilter.tagHistory', 'tagFilter')
      .leftJoinAndSelect('transaction.transactionTag', 'inputTransactionTag')
      .leftJoinAndSelect('inputTransactionTag.tagHistory', 'inputTag')
      .leftJoinAndSelect('transaction.transactionTag', 'outputTransactionTag')
      .leftJoinAndSelect('outputTransactionTag.tagHistory', 'outputTag')
      .andWhere(`transaction.user.id = ${userId}`);

    const {
      title,
      description,
      periodicity,
      startDate,
      endDate,
      minimumValue,
      maximumValue,
      tag,
      skip,
      limit,
      order,
    } = dto;
    query.skip(skip).take(limit);

    if (title) {
      query.andWhere('transaction.title ILIKE :title', { title: `%${title}%` });
    }

    if (description) {
      query.andWhere('transaction.description ILIKE :description', {
        description: `%${description}%`,
      });
    }

    if (periodicity) {
      query.andWhere('transaction.periodicity = :periodicity', {
        periodicity,
      });
    }

    if (tag?.length) {
      query.andWhere(
        `inputTag.id IN (:...tag) AND inputTransactionTag.transactionType = '${TransactionTypeEnum.INPUT}'
        OR outputTag.id IN (:...tag) AND inputTransactionTag.transactionType = '${TransactionTypeEnum.OUTPUT}'`,
        {
          tag,
        },
      );
    }

    if (minimumValue && maximumValue) {
      query.andWhere(
        'transaction.value BETWEEN :minimumValue AND :maximumValue',
        {
          minimumValue,
          maximumValue,
        },
      );
    } else if (minimumValue) {
      query.andWhere('transaction.value >= :minimumValue', { minimumValue });
    } else if (maximumValue) {
      query.andWhere('transaction.value <= :maximumValue', { maximumValue });
    }

    if (startDate && endDate) {
      query.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      query.andWhere('transaction.createdAt >= :startDate', { startDate });
    } else if (endDate) {
      query.andWhere('transaction.createdAt <= :endDate', { endDate });
    }

    if (order) {
      const [field, direction] = Object.entries(order)[0];
      query.orderBy(
        `transaction.${field}`,
        direction.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    return query;
  }
}
