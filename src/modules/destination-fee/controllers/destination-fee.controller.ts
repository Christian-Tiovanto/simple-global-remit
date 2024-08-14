import { Body, Controller, Post } from '@nestjs/common';
import { DestinationFeeService } from '../services/destination-fee.service';
import { CreateDestinationFeeDto } from '../dtos/create-destination-fee.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { Role } from 'src/enums/user-role';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Destination Fee')
@ApiBearerAuth()
@Controller('api/v1/destination-fee')
export class DestinationFeeController {
  constructor(private destinatoinFeeService: DestinationFeeService) {}

  @Auth(Role.ADMIN)
  @Post()
  async createDestinationFee(@Body() createDestinationFeeDto: CreateDestinationFeeDto) {
    return await this.destinatoinFeeService.createDestinationFee(createDestinationFeeDto);
  }
}
