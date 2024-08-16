import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Transaction } from '../models/transactions.entity';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../dtos/update-transaction-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePaidTransactionStatusDto } from '../dtos/update-paid-transaction-status.dto';
import * as path from 'path';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
@ApiTags('transaction')
@ApiBearerAuth()
@ApiExtraModels(Transaction)
@Controller('api/v1/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @ApiOperation({ summary: 'use this API to create a new transcation. Roles[admin,client]' })
  @ApiCreatedResponse({
    description: 'use this API to create a new transcation',
    schema: SwaggerResponseWrapper.createResponse(Transaction),
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTransaction(@Request() req, @Body() createTransactionQuery: CreateTransactionDto) {
    return await this.transactionService.createTransaction(createTransactionQuery, parseInt(req.user.id));
  }

  @ApiOperation({ summary: 'use this API to get logged in user transaction History. Roles[admin,client]' })
  @ApiOkResponse({
    description: 'use this API to get user transaction History',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getUserTransactionHistory(@Request() req) {
    return await this.transactionService.getUserTransactionHistory(req.user.id);
  }

  @ApiOperation({ summary: 'use this API to update user transaction status to ongoing. Roles[admin,client]' })
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'List Of photo', type: UpdatePaidTransactionStatusDto })
  @UseGuards(JwtAuthGuard)
  @Patch('pay')
  async updatePaidTransactionStatus(
    @Body() updatePaidTransactionStatusDto: UpdatePaidTransactionStatusDto,
    @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: 'image/*' }).build())
    file: Express.Multer.File,
  ) {
    return await this.transactionService.updatePaidTransactionStatus(updatePaidTransactionStatusDto, file.path);
  }

  @ApiOperation({ summary: 'use this API to update user transaction status to ongoing. Roles[admin,client]' })
  @ApiOkResponse({
    description: 'transaction status patched succesfully',
    schema: SwaggerResponseWrapper.createResponse(Transaction),
  })
  @Patch('update')
  async updateTransactionStatus(@Body() updateTransactionStatusDto: UpdateTransactionStatusDto) {
    return await this.transactionService.updateTransactionStatus(updateTransactionStatusDto);
  }

  @ApiOperation({ summary: 'use this API to retrieve transaction Photo. Roles[admin,client]' })
  @ApiOkResponse({ description: 'use this API to retrieve Photo' })
  @ApiParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard)
  @Get('photo/:id')
  async getPhoto(@Res() res, @Param('id', ParseIntPipe) id: number) {
    console.log(id);
    const photoPath = await this.transactionService.getTransactionPhoto(id);
    res.sendFile(path.resolve(`./${photoPath}`));
  }
}
