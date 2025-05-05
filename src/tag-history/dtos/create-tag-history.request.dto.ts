import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateTagHistoryRequestDTO {
  @IsNumber()
  @IsNotEmpty()
  originalTagId: number
}
