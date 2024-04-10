import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CronModule } from './cron/cron.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [CronModule, PrismaModule , ScheduleModule.forRoot()],
  controllers: [AppController],
})
export class AppModule {}
