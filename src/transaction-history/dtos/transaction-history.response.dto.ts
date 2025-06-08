import { TagHistoryResponseDTO } from '@tag-history/dtos/tag-history.response.dto';
import { TagResponseDTO } from '@tag/dtos/tag.response.dto';
import { TransactionHistory } from '@transaction-history/entity/transaction-history.entity';
import { TransactionTagHistory } from '@transaction-tag-history/entity/transaction-tag-history.entity';
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

  public static toDTO(transaction: TransactionHistory, tag?: number[]): TransactionHistoryResponseDTO {
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
    response.date = transaction.date
    response.inputTagList = inputList.map(({  tagHistory }) =>
      plainToInstance(TagHistoryResponseDTO, tagHistory, { excludeExtraneousValues: true }),
    );
    response.outputTagList = outputList.map(({ tagHistory }) =>
      plainToInstance(TagHistoryResponseDTO, tagHistory, { excludeExtraneousValues: true }),
    );
    response.value = response.getRelativeValue(transaction.value, inputList, tag)
    
    response.createdAt = transaction.createdAt.toISOString();
    return response;
  }

   getRelativeValue(value: number, inputTags: TransactionTagHistory[], tag?: number[]) {
    if(!tag?.length) return value
    const isInput = inputTags.some(({ tagHistory }) => tag?.includes(tagHistory.id))
    const sign = isInput ? -1 : +1
    return sign * value
  }
}
