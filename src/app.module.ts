import { Module } from '@nestjs/common';

import { DatabaseModule } from './config/database/database.module';
import { SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/shared/guards/jwt-auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigureModule } from './config/environments/config.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { ClientModule } from './client/client.module';
import { DeviceModule } from './device/device.module';
import { PartsAndServicesModule } from './parts_and_services/parts_and_services.module';
import { ProductModule } from './product/product.module';
import { SaleModule } from './sale/sale.module';
import { ServiceOrderModule } from './service_order/service_order.module';
import { TechnicianModule } from './technician/technician.module';
import { InvoiceModule } from './invoice/invoice.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ConfigureModule,
    // DatabaseModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'rmv',
      password: '12345',
      database: 'thunnar',
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true,
    }),
    SwaggerModule,
    ScheduleModule.forRoot(),
    UserModule,
    ProfileModule,
    CategoryModule,
    ClientModule,
    DeviceModule,
    PartsAndServicesModule,
    ProductModule,
    SaleModule,
    ServiceOrderModule,
    TechnicianModule,
    InvoiceModule
    
  ],
  controllers: [],
  providers: [
    
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule { }
