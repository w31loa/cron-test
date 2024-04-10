import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CronService } from './cron/cron.service';




@Controller()
export class AppController {
  constructor(private readonly cron:CronService) {}

  @Post()
  createCronJob(@Body() data) {
    return this.cron.createCron(data.date , data.id);
  }

  // чето такое принимает
  // {
  //   "date": "2024-04-10T14:42:00Z",
  //   "id": 2
  // }
}
