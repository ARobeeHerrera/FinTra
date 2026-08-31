import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsIn,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateTransactionDTO {
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

export class UpdateTransactionDTO {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount!: number;

  @IsIn(['INCOME', 'EXPENSE'])
  @IsOptional()
  type!: 'INCOME' | 'EXPENSE';

  @IsString()
  @IsOptional()
  categoryId!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsDateString()
  @IsOptional()
  date!: string;
}
