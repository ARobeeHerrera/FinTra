import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(['PHP', 'USD', 'JPY', 'SGD'])
  currency!: 'PHP' | 'USD' | 'JPY' | 'SGD';
}

export class UpdateAccountDTO {
  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsIn(['PHP', 'USD', 'JPY', 'SGD'])
  currency!: 'PHP' | 'USD' | 'JPY' | 'SGD';
}
