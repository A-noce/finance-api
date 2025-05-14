import { TagHistoryResponseDTO } from '@tag-history/dtos/tag-history.response.dto';
import { TagResponseDTO } from '@tag/dtos/tag.response.dto';
import { TransactionHistory } from '@transaction-history/entity/transaction-history.entity';
import { Transaction } from '@transaction/entity/transaction.entity';
import { TransactionPeriodEnum, TransactionTypeEnum } from '@typing/enums';
import { plainToInstance } from 'class-transformer';

export class TransactionHistoryResponseDTO {
  id: number;
  title: string;
  description: string;
  date: string
  value: number
  inputTagList: TagHistoryResponseDTO[];
  outputTagList: TagHistoryResponseDTO[];
  createdAt: string;

  public static toDTO(transaction: TransactionHistory): TransactionHistoryResponseDTO {
    const response = new TransactionHistoryResponseDTO();
    const inputList = transaction.transactionTag.filter(
      ({ transactionType }) => transactionType === TransactionTypeEnum.INPUT,
    );
    const outputList = transaction.transactionTag.filter(
      ({ transactionType }) => transactionType === TransactionTypeEnum.OUTPUT,
    );

    response.id = transaction.id;
    response.title = transaction.title;
    response.description = transaction.description;
    response.value = transaction.value
    
    response.inputTagList = inputList.map(({  tagHistory }) =>
      plainToInstance(TagHistoryResponseDTO, tagHistory, { excludeExtraneousValues: true }),
    );
    response.outputTagList = outputList.map(({ tagHistory }) =>
      plainToInstance(TagHistoryResponseDTO, tagHistory, { excludeExtraneousValues: true }),
    );
    response.createdAt = transaction.createdAt.toISOString();
    return response;
  }
}
