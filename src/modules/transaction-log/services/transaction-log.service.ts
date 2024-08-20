import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionLog } from '../models/transaction-log.entity';
import { Repository } from 'typeorm';
import { Transaction } from 'src/modules/transactions/models/transactions.entity';
import { TransactionStatus } from 'src/enums/transaction-status';

@Injectable()
export class TransactionLogService {
  constructor(@InjectRepository(TransactionLog) private transactionLogRepository: Repository<TransactionLog>) {}

  async createTransactionLog(transaction: Transaction, previous_state: TransactionStatus, modifier_id: number) {
    const transactionLog = await this.transactionLogRepository.create({
      transaction: transaction,
      previous_state: previous_state,
      current_state: transaction.status,
      modified_by: { id: modifier_id },
    });
    await this.transactionLogRepository.save(transactionLog);
    return transactionLog;
  }

  async getTransactionLogsByTransactionId(transaction_id: number) {
    const sql = `select * from transaction_log tl where tl.transaction_id = ${transaction_id}`;
    const transactionLogs = await this.transactionLogRepository.query(sql);
    return transactionLogs;
  }
}
