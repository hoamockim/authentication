import { MicroserviceOptions, Transport } from "@nestjs/microservices";

export const KafkaOptions: MicroserviceOptions = {
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
}