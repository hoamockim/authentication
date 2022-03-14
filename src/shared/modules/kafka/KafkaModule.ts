import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices"
import { ConsumeController, ProduceService } from "."

@Global()
@Module({
  imports: [
    ClientsModule.register([{
      name: 'AUTHCLIENT',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'authId',
          brokers: ['localhost:9092'],
        },
        consumer: {
            groupId: 'mtx-auth-1',
        }
      }
    }]),
  ],
  providers: [ProduceService],
  exports: [ProduceService],
  controllers: [ConsumeController]
})
export class KafkaModule {}