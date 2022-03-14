import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Client, ClientKafka, Transport } from "@nestjs/microservices";

@Injectable()
export class ProduceService implements OnModuleInit, OnModuleDestroy {
    constructor(@Inject('AUTHCLIENT')private readonly client: ClientKafka){}

  async send(topic: string, message: any){
    this.client.emit(topic, message)
  }

  async onModuleInit() {
    await this.client.connect()
  }

  async onModuleDestroy() {
    await this.client.close()
  }
}