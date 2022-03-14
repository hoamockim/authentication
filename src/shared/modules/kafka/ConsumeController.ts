import { Controller,} from "@nestjs/common";
import { MessagePattern, Transport } from "@nestjs/microservices";

@Controller()
export default class ConsumeController  {
    @MessagePattern(`${process.env.SIGNUP_RESULT_EVENT}`, Transport.KAFKA)
    consumeSignUpResultEvent(message: any){
        console.log('[KAKFA-CONSUMER] Print message after receiving: ', message.value);
    }
}