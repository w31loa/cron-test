import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports:[PrismaModule, ScheduleModule.forRoot()], 
  providers: [CronService],
  exports :[CronService]
})
export class CronModule {}
