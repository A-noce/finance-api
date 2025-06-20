import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { Transaction } from '@transaction/entity/transaction.entity';
import { FilterTransactionParamsRequestDTO } from '@transaction/dtos/filter-transacrion-params.request.dto';
import { CreateTransactionRequestDTO } from '@transaction/dtos/create-transaction.request.dto';
import { UpdateTransactiopnRequestDTO } from '@transaction/dtos/update-transaction.request.dto';
import { TagService } from '@tag/services/tag.service';
import { TagEntity } from '@tag/entity/tag.entity';
import { TransactionTypeEnum } from '@typing/enums';
import { TransactionTag } from '@transaction-tag/entity/transaction-tag.entity';
import { UserService } from '@user/services/user.service';
import { TransactionResponseDTO } from '@transaction/dtos/transaction.response.dto';
import { ResponseDTO } from '@shared/dtos/ResponseDTO';
import { User } from '@user/entity/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
    private readonly tagService: TagService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  public async findById(id: number) {
    return await this.repository.findOne({
      relations: ['transactionTag', 'transactionTag.tag'],
      where: { id },
    });
  }

  public async findByParam(
    param: FilterTransactionParamsRequestDTO,
    request: Request,
  ) {
    const loggedUser: User = request['user'];
    const [data, total] = await this.buildQuery(
      param,
      loggedUser.id,
    ).getManyAndCount();
    return new ResponseDTO().setBody({
      data: data.map(TransactionResponseDTO.toDTO),
      total,
    });
  }

  public async findAll() {
    const [data, total] = await this.repository.findAndCount({
      relations: ['transactionTag.tag', 'user'],
    });
    return { data: data.map(TransactionResponseDTO.toDTO), total };
  }

  public async createTransaction(
    dto: CreateTransactionRequestDTO,
    request: Request,
  ) {
    const loggedUser: User = request['user'];
    const inputTagList = await this.tagService.findTagList(dto.listInputTagId);
    const outputTagList = await this.tagService.findTagList(
      dto.listOutputTagId,
    );
    const user = await this.userService.findById(loggedUser.id);
    const transactionId = await this.dataSource.transaction(async (manager) => {
      const entity = manager.create(Transaction, { ...dto, user });
      const transaction = await manager.save(entity);
      await this.createTransactionTag(
        transaction,
        manager,
        inputTagList,
        TransactionTypeEnum.INPUT,
      );
      await this.createTransactionTag(
        transaction,
        manager,
        outputTagList,
        TransactionTypeEnum.OUTPUT,
      );
      return transaction.id;
    });
    return await this.findById(transactionId);
  }

  public async updateTransaction(
    id: number,
    dto: UpdateTransactiopnRequestDTO,
  ) {
    const transaction = this.repository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    const updatedTransaction = Object.assign(transaction, dto);
    return this.repository.save(updatedTransaction);
  }

  private async createTransactionTag(
    transaction: Transaction,
    manager: EntityManager,
    tagList: TagEntity[],
    transactionType: TransactionTypeEnum,
  ) {
    const promiseList = tagList.map((tag) => {
      const payload = manager.create(TransactionTag, {
        transaction,
        tag,
        transactionType,
      });
      return manager.save(payload);
    });
    await Promise.all(promiseList);
  }

  private buildQuery(dto: FilterTransactionParamsRequestDTO, userId: number) {
    const query = this.repository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.transactionTag', 'transactionTagFilter')
      .leftJoin('transactionTagFilter.tag', 'tagFilter')
      .leftJoinAndSelect('transaction.transactionTag', 'inputTransactionTag')
      .leftJoinAndSelect('inputTransactionTag.tag', 'inputTag')
      .leftJoinAndSelect('transaction.transactionTag', 'outputTransactionTag')
      .leftJoinAndSelect('outputTransactionTag.tag', 'outputTag')
      .andWhere(`transaction.user.id = ${userId}`);

    const {
      title,
      description,
      periodicity,
      startDate,
      endDate,
      minimumValue,
      maximumValue,
      listInputTagId,
      listOutputTagId,
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

    if (listInputTagId?.length) {
      query.andWhere(
        `inputTag.id IN (:...listInputTagId) AND inputTransactionTag.transactionType = '${TransactionTypeEnum.INPUT}'`,
        {
          listInputTagId,
        },
      );
    }

    if (listOutputTagId?.length) {
      query.andWhere(
        `outputTag.id IN (:...listOutputTagId) AND inputTransactionTag.transactionType = '${TransactionTypeEnum.OUTPUT}'`,
        {
          listOutputTagId,
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
