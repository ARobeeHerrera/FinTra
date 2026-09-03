import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth-guard';
import { CreateAccountUseCase } from '../useCase/create-account.use-case';
import { CreateAccountDTO, UpdateAccountDTO } from '../dto/AccountDTO';
import { Account } from '../domain/entity/account.entity';
import { AuthenticatedRequest } from '../../../auth/presentation/auth-controller';
import { FindAccountByUserIdUseCase } from '../useCase/find-account-by-user-id.use-case';
import { UpdateAccountUseCase } from '../useCase/update-account.use-case';
import { DeleteAccountUseCase } from '../useCase/delete-account.use-case';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly findAccountByUserIdUseCase: FindAccountByUserIdUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccount(
    @Body() dto: CreateAccountDTO,
    @Req() req: AuthenticatedRequest,
  ): Promise<Account> {
    const account = await this.createAccountUseCase.execute({
      ...dto,
      userId: req.user.id,
    });

    return account;
  }

  @Get(':me')
  async findMyAccount(@Req() req: AuthenticatedRequest): Promise<Account> {
    const account = await this.findAccountByUserIdUseCase.execute(req.user.id);

    return account;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateAccount(
    @Param('id') id: string,
    @Body() dto: UpdateAccountDTO,
    @Req() req: AuthenticatedRequest,
  ): Promise<Account> {
    const account = await this.updateAccountUseCase.execute({
      id: id,
      userId: req.user.id,
      ...dto,
    });

    return account;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.deleteAccountUseCase.execute({
      id: id,
      userId: req.user.id,
    });
  }
}
