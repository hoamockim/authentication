import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from './app.module'
import { KafkaOptions, RedisOption } from './options'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.connectMicroservice<MicroserviceOptions>(RedisOption)
  app.connectMicroservice<MicroserviceOptions>(KafkaOptions)
  app.enableCors()

  const logger = new Logger('bootstrap')
  logger.log(`Application listening on port ${process.env.APP_PORT }`)
 
  await app.startAllMicroservices()
  app.listen(process.env.APP_PORT)
}
bootstrap();
