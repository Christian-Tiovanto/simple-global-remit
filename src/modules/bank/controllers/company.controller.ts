import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { CreateCompanyBankDto } from '../dtos/createCompanyBankDto';
import { Auth } from 'src/decorators/auth.decorator';
import { Role } from 'src/enums/user-role';
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { Company } from '../model/company.entity';
import { GetCompanyBankListResponse } from '../classes/company.class';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
@ApiTags('company')
@Controller('api/v1/company')
@ApiExtraModels(Company, GetCompanyBankListResponse)
export class CompanyController {
  constructor(private bankService: CompanyService) {}

  @ApiOperation({ summary: 'use this API to add the company bank list. Roles[admin]' })
  @ApiCreatedResponse({
    description: 'use this API to add the company bank list',
    schema: SwaggerResponseWrapper.createResponse(CreateCompanyBankDto),
  })
  @Auth(Role.ADMIN)
  @Post()
  async createCompanyBank(@Body() createCompanyBankDto: CreateCompanyBankDto) {
    return await this.bankService.createCompanyBank(createCompanyBankDto);
  }

  @ApiOperation({ summary: 'use this API to get all the company bank list. Roles[admin,client]' })
  @ApiOkResponse({
    description: 'use this API to get all the company bank list',
    schema: SwaggerResponseWrapper.createResponse(GetCompanyBankListResponse),
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCompanyBankList() {
    return await this.bankService.getCompanyBankList();
  }
}
