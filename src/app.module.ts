import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankReconciliationModule } from './bank-reconciliation/bank-reconciliation.module';

@Module({
  imports: [BankReconciliationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
