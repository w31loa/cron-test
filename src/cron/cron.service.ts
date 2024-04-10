import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronJob } from 'cron';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseDate } from 'src/utils/parseDate';

@Injectable()
export class CronService implements OnModuleInit {

    constructor(private readonly prisma:PrismaService){}


    async onModuleInit() {
        const allCrons = await this.prisma.cron.findMany()
        allCrons.forEach((e,i)=>{
            this.setCron(e.expressionDate, e.orderId , i)
        })
    }

    async setCron(expressionDate:Date , orderId:number , i?:number){
        let date = new Date(expressionDate);
        const dateNow = moment().utc(true).format()

        
        if(date.toISOString()<dateNow){
            date = new Date(dateNow)
            date = new Date(date.setMinutes(date.getMinutes()+2*(i+1)))
        }
        
        this.createJob(date, orderId) 

        

    }

    async createCron(expressionDate:Date , orderId:number){

        const date = new Date(expressionDate);
        
        this.createJob(date , orderId) 
        await this.prisma.cron.create({
            data: {expressionDate: date.toISOString(), orderId}
        })

    }


    private async createJob(date:Date ,  orderId:number){
        const parsedDate = parseDate(date)


        const cronExpression = `${parsedDate.minutes} ${parsedDate.hours} ${parsedDate.day} ${parsedDate.month} *`;
        const job = new CronJob(cronExpression ,async ()=>{

            await this.prisma.order.update({
                where:{id:orderId},
                data:{title: 'Крон сработал ура'}
            })  
            await this.prisma.cron.delete({
                where:{
                    orderId
                }
            })

            console.log('job done')
            job.stop()
        })

        job.start()

    
        console.log(`CronJob for order with id: ${orderId} is scheduled for  ${parsedDate.day}.${parsedDate.month}.${parsedDate.year} ${parsedDate.hours}:${parsedDate.minutes} `)
    }

}
