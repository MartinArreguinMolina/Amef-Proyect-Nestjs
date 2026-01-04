import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        port: 465,
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
          user: 'uzonenergy@gmail.com',
          pass: 'dqaj olqq aqoy ygpg',
        }
      } ,
      defaults: {
        from: `"Soporte" <uzonenergy>`
      }
    })
  ]
})
export class MailModule {}
