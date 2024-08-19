import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { CreateCompanyBankDto } from '../dtos/create-company-bank.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { Role } from 'src/enums/user-role';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { Company } from '../model/company.entity';
import { GetCompanyBankListResponse } from '../classes/company.class';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateCompanyBankDto } from '../dtos/update-company-bank.dto';
@ApiTags('company')
@Controller('api/v1/company')
@ApiBearerAuth()
@ApiExtraModels(Company, GetCompanyBankListResponse, UpdateCompanyBankDto)
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @ApiOperation({ summary: 'use this API to add the company bank list. Roles[admin]' })
  @ApiCreatedResponse({
    description: 'use this API to add the company bank list',
    schema: SwaggerResponseWrapper.createResponse(CreateCompanyBankDto),
  })
  @Auth(Role.ADMIN)
  @Post()
  async createCompanyBank(@Body() createCompanyBankDto: CreateCompanyBankDto) {
    return await this.companyService.createCompanyBank(createCompanyBankDto);
  }

  @ApiOperation({ summary: 'use this API to get all the company bank list. Roles[admin,client]' })
  @ApiOkResponse({
    description: 'use this API to get all the company bank list',
    schema: SwaggerResponseWrapper.createResponse(GetCompanyBankListResponse),
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCompanyBankList() {
    return await this.companyService.getCompanyBankList();
  }

  @ApiOperation({ summary: 'use this API to update company bank information. Roles:[admin]' })
  @ApiOkResponse({ schema: SwaggerResponseWrapper.createResponse(UpdateCompanyBankDto) })
  @Auth(Role.ADMIN)
  @Patch()
  async updateCompanyBank(@Body() updateCompanyBankDto: UpdateCompanyBankDto) {
    return await this.companyService.updateCompanyBank(updateCompanyBankDto);
  }

  @ApiOperation({ summary: 'use this API to delete spesific company bank row. Roles[admin]' })
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  // @Auth(Role.ADMIN)
  async deleteCompanyBank(@Param('id') id: number) {
    await this.companyService.deleteCompanyBank(id);
  }
}
