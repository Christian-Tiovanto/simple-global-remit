import { Body, Controller, Post } from '@nestjs/common';
import { DestinationFeeService } from '../services/destination-fee.service';
import { CreateDestinationFeeDto } from '../dtos/create-destination-fee.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { Role } from 'src/enums/user-role';
import { ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { DestinationFee } from '../model/destination-fee.entity';

@ApiTags('Destination Fee')
@ApiBearerAuth()
@ApiExtraModels(DestinationFee)
@Controller('api/v1/destination-fee')
export class DestinationFeeController {
  constructor(private destinatoinFeeService: DestinationFeeService) {}

  @ApiOperation({ summary: 'use this API to create a new Destination Fee. Roles[admin]' })
  @ApiCreatedResponse({ schema: SwaggerResponseWrapper.createResponse(DestinationFee) })
  @Auth(Role.ADMIN)
  @Post()
  async createDestinationFee(@Body() createDestinationFeeDto: CreateDestinationFeeDto) {
    return await this.destinatoinFeeService.createDestinationFee(createDestinationFeeDto);
  }
}
