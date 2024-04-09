import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronService {

    constructor(private readonly prisma:PrismaService){}

    async cronTest(expressionDate:Date , orderId:number){

        const date = new Date(expressionDate);

        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1; 
        const day = date.getUTCDate();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();

        const cronExpression = `${minutes} ${hours} ${day} ${month} *`;

        const job = new CronJob(cronExpression ,async ()=>{

            await this.prisma.order.update({
                where:{id:orderId},
                data:{title: 'Крон сработал ура'}
            })

            console.log('doing something......')
        })

        job.start()

        await this.prisma.cron.create({
            data: {expressionDate, orderId}
        })

        console.log(`CronJob for order with id: ${orderId} is scheduled for  ${day}.${month}.${year} ${hours}:${minutes} `)

    }

}
