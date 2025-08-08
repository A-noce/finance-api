import {
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateTagRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'The color must be a valid HEX code',
  })
  color: string;
}
