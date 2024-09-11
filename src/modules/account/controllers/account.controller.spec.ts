import { Test } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from '../services/account.service';
import { CurrencyModule } from 'src/modules/currency/currency.module';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
describe('AccountController', () => {
  beforeEach(async () => {
    let accountService: DeepMocked<AccountService>;
    let accountController: AccountController;
    const moduleRef = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: createMock<AccountService>(),
        },
        {
          provide: JwtAuthGuard,
          useValue: createMock<JwtAuthGuard>(),
        },
      ],
      imports: [CurrencyModule],
    }).compile();

    accountService = moduleRef.get(AccountService);
    accountController = moduleRef.get<AccountController>(AccountController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      //   jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

      //   expect(await catsController.findAll()).toBe(result);
    });
  });
});
