import { Body, Controller, Get, Post } from '@nestjs/common';
import { CountryService } from './../services/country.service';
import { CreateCountryDto } from '../dtos/create-country.dto';
import { AddCountryCurrencyDto } from '../dtos/add-country-currency.dto';
import { Auth } from 'src/decorators/auth.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { CountryCurrency } from '../model/country-currency.entity';
import { GetAllCountryAndCurrencyResponse } from '../classes/country.class';
import { Role } from 'src/enums/user-role';
@ApiTags('country')
@ApiBearerAuth()
@Controller('api/v1/country')
@ApiExtraModels(CountryCurrency, GetAllCountryAndCurrencyResponse)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiOperation({ summary: 'use this API to create the Country Data. Roles:[Admin]' })
  @ApiCreatedResponse({
    description: 'use this API to create the Country Data',
    schema: SwaggerResponseWrapper.createResponse(CreateCountryDto),
  })
  @Auth(Role.ADMIN)
  @Post()
  async createCountry(@Body() createCountryDto: CreateCountryDto) {
    return await this.countryService.createCountry(createCountryDto);
  }

  @ApiOperation({ summary: 'Use this API to add the available currency in the specified country. Roles:[Admin]' })
  @ApiCreatedResponse({
    description: 'Use this API to add the available currency in the specified country',
    schema: SwaggerResponseWrapper.createResponse(CountryCurrency),
  })
  @Auth(Role.ADMIN)
  @Post('currency')
  async addCountryCurrency(@Body() addCountryCurrencyDto: AddCountryCurrencyDto) {
    return this.countryService.addCountryCurrency(addCountryCurrencyDto);
  }

  @ApiOperation({ summary: 'use this API to get all the country and their available currency. Roles:[admin,client]' })
  @ApiOkResponse({
    description: 'use this API to get all the country and their available currency',
    schema: SwaggerResponseWrapper.createResponseList(GetAllCountryAndCurrencyResponse),
  })
  @Get('all')
  async getAllCountryAndCurrency() {
    return this.countryService.getAllCountryAndCurrency();
  }
}
