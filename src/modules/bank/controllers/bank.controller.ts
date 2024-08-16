import { Body, Controller, Get, Post } from '@nestjs/common';
import { BankService } from '../services/bank.service';
import { CreateCompanyBankDto } from '../dtos/createCompanyBankDto';
import { Auth } from 'src/decorators/auth.decorator';
import { Role } from 'src/enums/user-role';
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { Bank } from '../model/bank.entity';
@ApiTags('Bank')
@Controller('api/v1/bank')
@ApiExtraModels(Bank)
export class BankController {
  constructor(private bankService: BankService) {}

  @ApiCreatedResponse({
    description: 'use this API to add the company bank list',
    schema: SwaggerResponseWrapper.createResponse(CreateCompanyBankDto),
  })
  @Auth(Role.ADMIN)
  @Post()
  async createCompanyBank(@Body() createCompanyBankDto: CreateCompanyBankDto) {
    return await this.bankService.createCompanyBank(createCompanyBankDto);
  }

  @ApiOkResponse({
    description: 'use this API to get all the company bank list',
    schema: SwaggerResponseWrapper.createResponseList(Bank),
  })
  @Get()
  async getCompanyBankList() {
    return await this.bankService.getCompanyBankList();
  }
}
