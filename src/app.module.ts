import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppService } from './app.service'
import { AuthModule } from './module/Authenticate/AuthModule'
import { AppController } from './module/system/app.controller'
import { KafkaModule, RedisCacheModule } from './shared/modules'

@Module({
  imports: [
    ConfigModule.forRoot(),
    KafkaModule,
    RedisCacheModule,
    AuthModule
  ],
  providers: [AppService],
  controllers: [AppController]
})
export class AppModule {}
