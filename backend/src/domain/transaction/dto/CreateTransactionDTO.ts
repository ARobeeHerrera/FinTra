import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateTransactionDTO {
  @IsString()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  accountId!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsIn(['INCOME', 'EXPENSE'])
  type!: 'INCOME' | 'EXPENSE';

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  date!: string;
}
