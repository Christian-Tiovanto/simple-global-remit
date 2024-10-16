import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Transaction } from '../models/transactions.entity';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../dtos/update-transaction-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePaidTransactionStatusDto } from '../dtos/update-paid-transaction-status.dto';
import * as path from 'path';
import { SwaggerResponseWrapper } from 'src/utils/api-response-wrapper';
import { TransactionStatus } from 'src/enums/transaction-status';
import { Auth } from 'src/decorators/auth.decorator';
import { Role } from 'src/enums/user-role';
import { GetUserTransactionQuery } from '../classess/transaction.class';
import { User } from 'src/decorators/user.decorator';
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

  @ApiQuery({
    description: 'use the query string for defining the transaction status',
    name: 'status',
    required: false,
  })
  @ApiOperation({ summary: 'use this API to get logged in user transaction History. Roles[admin,client]' })
  @ApiOkResponse({
    description: 'use this API to get user transaction History',
    schema: SwaggerResponseWrapper.createResponseList(Transaction),
  })
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getLoggedInUserTransaction(@Request() req, @Query() query: GetUserTransactionQuery) {
    return await this.transactionService.getUserTransaction(req.user.id, query.status);
  }
  @ApiQuery({
    description: 'use the query string for defining the transaction status',
    name: 'status',
    required: false,
  })
  @ApiOperation({ summary: 'use this API to get specific user transaction History. Roles[admin]' })
  @ApiOkResponse({
    description: 'use this API to get user transaction History',
    schema: SwaggerResponseWrapper.createResponseList(Transaction),
  })
  @Auth(Role.ADMIN)
  @Get('/user/:id')
  async getUserTransaction(@Param('id') id: number, @Query() query: GetUserTransactionQuery) {
    return await this.transactionService.getUserTransaction(id, query.status);
  }

  @ApiOperation({ summary: 'use this API to update user transaction status to ongoing. Roles[admin,client]' })
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'List Of photo', type: UpdatePaidTransactionStatusDto })
  @ApiOkResponse({ schema: SwaggerResponseWrapper.createResponse(Transaction) })
  @UseGuards(JwtAuthGuard)
  @Patch('pay')
  async updatePaidTransactionStatus(
    @User() user,
    @Body() updatePaidTransactionStatusDto: UpdatePaidTransactionStatusDto,
    @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: 'image/*' }).build())
    file: Express.Multer.File,
  ) {
    return await this.transactionService.updatePaidTransactionStatus(
      updatePaidTransactionStatusDto,
      file.path,
      user.id,
    );
  }

  @ApiOperation({ summary: 'use this API to update user transaction status to ongoing. Roles[admin,client]' })
  @ApiOkResponse({
    description: 'transaction status patched succesfully',
    schema: SwaggerResponseWrapper.createResponse(Transaction),
  })
  @Auth(Role.ADMIN)
  @Patch('update')
  async updateTransactionStatus(@User() user, @Body() updateTransactionStatusDto: UpdateTransactionStatusDto) {
    return await this.transactionService.updateTransactionStatus(updateTransactionStatusDto, user.id);
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

  @ApiOperation({ summary: 'use this API to get all transaction by their status' })
  @ApiOkResponse({ schema: SwaggerResponseWrapper.createResponseList(Transaction) })
  @Auth(Role.ADMIN)
  @Get('all/status/:status')
  async getAllTransactionByStatus(@Param('status') status: TransactionStatus) {
    return await this.transactionService.getAllTransactionByStatus(status);
  }

  @ApiOperation({ summary: 'use this API to get Logged In User spesific transaction' })
  @ApiOkResponse({ schema: SwaggerResponseWrapper.createResponse(Transaction) })
  @UseGuards(JwtAuthGuard)
  @Get('me/transaction/:id')
  async getLoggedInUserSpesificTransaction(@User() user, @Param('id') transactionId: number) {
    return await this.transactionService.getLoggedInUserSpesificTransaction(user.id, transactionId);
  }
}
