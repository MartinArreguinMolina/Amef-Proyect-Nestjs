import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationalInformationModule } from './organizational-information/organizational-information.module';
import { AmefReportModule } from './amef-report/amef-report.module';
import { PrinterModule } from './printer/printer.module';
import { AnalysisModule } from './analysis/analysis.module';
import { ActionModule } from './action/action.module';
import { DepartmentsModule } from './departments/departments.module';
import { CommentsModule } from './comments/comments.module';
import { WebSocketModule } from './web-socket/web-socket.module';
import { MessagesModule } from './messages/messages.module';
import { RoomMembersModule } from './room-members/room-members.module';
import { envs } from './config/envs';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [

    AuthModule,

    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: envs.DB_HOST,
      database: envs.DB_NAME,
      port: envs.DB_PORT,
      password: envs.DB_PASSWORD,
      username: envs.DB_USERNAME,
      autoLoadEntities: true,
      synchronize: true
    }),

    OrganizationalInformationModule,

    AmefReportModule,

    PrinterModule,

    AnalysisModule,

    ActionModule,

    DepartmentsModule,

    CommentsModule,

    WebSocketModule,

    MessagesModule,

    RoomMembersModule,

    MailModule,

  ],
  controllers: [],
  providers: [],
})

export class AppModule {
  
}
