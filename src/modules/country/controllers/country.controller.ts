import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CountryService } from './../services/country.service';
import { CreateCountryDto } from '../dtos/create-country.dto';
import { AddCountryCurrencyDto } from '../dtos/add-country-currency.dto';
import { Roles } from 'src/decorators/role-decorator';
import { RolesGuard } from 'src/guards/roles-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Role } from 'src/enums/user-role';
import { Auth } from 'src/decorators/auth.decorator';

@Controller('api/v1/country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Auth(Role.ADMIN)
  @Post()
  async createCountry(@Body() createCountryDto: CreateCountryDto) {
    return await this.countryService.createCountry(createCountryDto);
  }

  @Auth(Role.ADMIN)
  @Post('currency')
  async addCountryCurrency(@Body() addCountryCurrencyDto: AddCountryCurrencyDto) {
    return this.countryService.addCountryCurrency(addCountryCurrencyDto);
  }

  @Get('all')
  async getAllCountryAndCurrency() {
    return this.countryService.getAllCountryAndCurrency();
  }
}
