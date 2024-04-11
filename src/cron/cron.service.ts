import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseDate } from 'src/utils/parseDate';

@Injectable()
export class CronService implements OnModuleInit {

    constructor(private readonly prisma:PrismaService,
                private schedulerRegistry:SchedulerRegistry
    ){}


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

    async getAllCrons():Promise<any>{
        const crons = await this.schedulerRegistry.getCronJobs

        console.log(crons)
        return crons
    }

    async updateCron(expressionDate:Date , orderId:number){
        const date = new Date(expressionDate);
        const parsedDate = parseDate(date)


        const cronExpression = `* ${parsedDate.minutes} ${parsedDate.hours} ${parsedDate.day} ${parsedDate.month} *`;


        const cronTime = new CronTime(cronExpression)
        const currentCron = this.schedulerRegistry.getCronJob(`${orderId}`)
        currentCron.setTime(cronTime)

        await this.prisma.cron.update({
            where: {
                orderId
            },
            data:{
                expressionDate:expressionDate
            }
        })

        console.log(`CronJob for order with id: ${orderId} is updated  for this time:   ${parsedDate.day}.${parsedDate.month}.${parsedDate.year} ${parsedDate.hours}:${parsedDate.minutes} `)

       return  0
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

            console.log(`job for order with id ${orderId} done `)
            job.stop()
            this.schedulerRegistry.deleteCronJob(String(orderId))
        }) 

        job.cronTime
        
        this.schedulerRegistry.addCronJob(String(orderId), job)


        job.start()

        
        console.log(`CronJob for order with id: ${orderId} is scheduled for  ${parsedDate.day}.${parsedDate.month}.${parsedDate.year} ${parsedDate.hours}:${parsedDate.minutes} `)
    }

}
