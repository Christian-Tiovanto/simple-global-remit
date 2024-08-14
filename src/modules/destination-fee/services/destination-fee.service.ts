import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DestinationFee } from '../model/destination-fee.entity';
import { Repository } from 'typeorm';
import { CountryService } from 'src/modules/country/services/country.service';
import { CreateDestinationFeeDto } from '../dtos/create-destination-fee.dto';
import { getDestinationFeeDto } from '../dtos/getDestinationFee.dto';

@Injectable()
export class DestinationFeeService {
  constructor(
    @InjectRepository(DestinationFee) private destinationFeeRepository: Repository<DestinationFee>,
    private countryService: CountryService,
  ) {}

  async createDestinationFee(createDestinationFeeDto: CreateDestinationFeeDto) {
    const { from_country, to_country, fee } = createDestinationFeeDto;
    const fromCountry = await this.countryService.getCountry({ country_signature: from_country });
    const toCountry = await this.countryService.getCountry({ country_signature: to_country });
    const destinationFee = await this.destinationFeeRepository.create({
      from_country: fromCountry,
      to_country: toCountry,
      fee,
    });
    await this.destinationFeeRepository.save(destinationFee);
    return destinationFee;
  }

  async getDestinationFee(getDestinationFeeDto: getDestinationFeeDto) {
    const { from_country, to_country } = getDestinationFeeDto;
    const destinationFee = await this.destinationFeeRepository.findOne({
      where: { from_country: { country_signature: 'IDN' }, to_country: { country_signature: to_country } },
    });
    if (!destinationFee)
      throw new BadRequestException(`there is no destination fee yet from ${from_country} to ${to_country} `);
    return Number(destinationFee.fee);
  }
}
