import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CronModule } from './cron/cron.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CronModule, PrismaModule],
  controllers: [AppController],
})
export class AppModule {}
