import {
  Body,
  Controller,
  Get,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from '../models/transactions.entity';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../dtos/update-transaction-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePaidTransactionStatusDto } from '../dtos/update-paid-transaction-status.dto';

@ApiTags('transaction')
@ApiBearerAuth()
@Controller('api/v1/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @ApiCreatedResponse({ description: 'use this API to create a new transcation', type: Transaction })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTransaction(@Request() req, @Body() createTransactionQuery: CreateTransactionDto) {
    return await this.transactionService.createTransaction(createTransactionQuery, parseInt(req.user.id));
  }

  @ApiOkResponse({
    description: 'use this API to get user transaction History',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTransactionHistory(@Request() req) {
    return await this.transactionService.getUserTransactionHistory(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'List Of photo', type: UpdatePaidTransactionStatusDto })
  @Patch('pay')
  async updatePaidTransactionStatus(
    @Body() updatePaidTransactionStatusDto: UpdatePaidTransactionStatusDto,
    @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: 'image/*' }).build())
    file: Express.Multer.File,
  ) {
    return await this.transactionService.updatePaidTransactionStatus(updatePaidTransactionStatusDto, file.path);
  }

  @Patch('update')
  async updateTransactionStatus(@Body() updateTransactionStatusDto: UpdateTransactionStatusDto) {
    return await this.transactionService.updateTransactionStatus(updateTransactionStatusDto);
  }
}
