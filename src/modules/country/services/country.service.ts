import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../model/country.entity';
import { Repository } from 'typeorm';
import { CreateCountryDto } from '../dtos/create-country.dto';
import { AddCountryCurrencyDto } from '../dtos/add-country-currency.dto';
import { getConstraintError } from 'src/utils/get-error-constraint';
import { CurrencyService } from 'src/modules/currency/services/currency.service';
import { CountryCurrency } from '../model/country-currency.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private countryRepository: Repository<Country>,
    @InjectRepository(CountryCurrency) private countryCurrencyRepository: Repository<CountryCurrency>,
    private currencyService: CurrencyService,
  ) {}

  async createCountry(createCountryDto: CreateCountryDto) {
    const country = await this.countryRepository.create(createCountryDto);
    console.log(country);
    await this.countryRepository.save(country);
    return country;
  }
  async addCountryCurrency(addCountryCurrDto: AddCountryCurrencyDto) {
    try {
      const { country, currency } = await this.getCountryAndCurrency(
        addCountryCurrDto.country_signature,
        addCountryCurrDto.country_currency,
      );
      const countryCurrency = await this.countryCurrencyRepository.create({
        country_signature: country,
        country_currency: currency,
      });
      await this.countryCurrencyRepository.save(countryCurrency);
      return countryCurrency;
    } catch (error) {
      getConstraintError(error);
    }
  }
  private async getCountryAndCurrency(country_signature: string, country_currency: string) {
    const country = await this.countryRepository.findOne({
      where: { country_signature },
    });
    if (!country) throw new BadRequestException('there is no country with that signature');
    const currency = await this.currencyService.getCurrency(country_currency);
    if (!currency) throw new BadRequestException('there is no currency with that signature');
    return { country, currency };
  }

  async getAllCountryAndCurrency() {
    const sql = `select c.country_signature ,c.country_name,cc.fee,array_agg(cc.country_currency ) country_currency from country c left join country_currency cc on c.country_signature  = cc.country_signature group by c.country_signature, cc.fee`;
    const result = await this.countryCurrencyRepository.query(sql);
    console.log(result);
    return result;
    // return await this.countryCurrencyRepository.find({
    //   relations: { country_currency: true, country_signature: true },
    // });
  }
}
