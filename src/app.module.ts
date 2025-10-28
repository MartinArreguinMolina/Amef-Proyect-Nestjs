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

@Module({
  imports: [

    AuthModule,
    // Variables de entorno
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: +process.env.DB_PORT!,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
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

  ],
  controllers: [],
  providers: [],
})

export class AppModule {
  
}
