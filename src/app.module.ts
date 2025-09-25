import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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

  ],
  controllers: [],
  providers: [],
})

export class AppModule {
  
}
