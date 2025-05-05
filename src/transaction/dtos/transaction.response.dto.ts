import { TagResponseDTO } from '@tag/dtos/tag.response.dto';
import { Transaction } from '@transaction/entity/transaction.entity';
import { TransactionPeriodEnum, TransactionTypeEnum } from '@typing/enums';
import { plainToInstance } from 'class-transformer';

export class TransactionResponseDTO {
  id: number;
  title: string;
  description: string;
  periodicity: TransactionPeriodEnum;
  periodValue: string;
  value: number
  inputTagList: TagResponseDTO[];
  outputTagList: TagResponseDTO[];
  createdAt: string;

  public static toDTO(transaction: Transaction): TransactionResponseDTO {
    const response = new TransactionResponseDTO();
    const inputList = transaction.transactionTag.filter(
      ({ transactionType }) => transactionType === TransactionTypeEnum.INPUT,
    );
    const outputList = transaction.transactionTag.filter(
      ({ transactionType }) => transactionType === TransactionTypeEnum.OUTPUT,
    );

    response.id = transaction.id;
    response.title = transaction.title;
    response.description = transaction.description;
    response.periodicity = transaction.periodicity;
    response.periodValue = transaction.periodValue;
    response.value = transaction.value
    
    response.inputTagList = inputList.map(({ tag }) =>
      plainToInstance(TagResponseDTO, tag, { excludeExtraneousValues: true }),
    );
    response.outputTagList = outputList.map(({ tag }) =>
      plainToInstance(TagResponseDTO, tag, { excludeExtraneousValues: true }),
    );
    response.createdAt = transaction.createdAt.toISOString();
    return response;
  }
}
