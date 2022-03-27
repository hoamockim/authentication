import { HttpService } from "@nestjs/axios"
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { map } from "rxjs"
import { ProduceService } from "../../shared/modules/kafka"
import { RedisCacheService } from "../../shared/modules/redis"
import { StringUtil } from "../../util"
import { AuthType } from "./AuthType"
import { SignUpRequestBody } from "./dtos"
import { OK, ResultType, ServiceResult } from "./ServiceResult"

@Injectable()
export class AuthService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly redisService: RedisCacheService,
        private readonly httpService: HttpService,
        private readonly jwtService: JwtService,
        private readonly produce : ProduceService
    ){}

    async signUp(signUpInfo: SignUpRequestBody) {
        await this.produce.send(process.env.SIGNUP_EVENT, {
            eventId: StringUtil.generateRandom(22),
            eventName: "SignUp",
            payload: {
                type: AuthType.Email,
                email: signUpInfo.email,
                password: signUpInfo.password,
                timestamp: new Date().getUTCSeconds()
            }
        })
    }

    validate(email: string, password: string) {
        const HEADERS = {
            'content-type': 'application/json',
            'authorization': ''
        }
        const veriry = process.env.USER_PROFILE + "/verify"
      
        return this.httpService.post(veriry, {
            email: email,
            password: password
        }, {headers: HEADERS}).pipe(
            map(value => {
                if (value.data.code != HttpStatus.OK) {
                    return new ServiceResult(ResultType.Error, value.data.message, {})
                }
                return new ServiceResult(ResultType.Success, OK, { ...value.data})
            })
        )
    }

    async generateToken(user: any, authType: AuthType): Promise<string> {
        const token = this.jwtService.sign(user)
        await this.produce.send(process.env.AUTH_EVENT, 
            { 
                eventId: StringUtil.generateRandom(22),
                eventName: authType,
                payload: {
                    type: authType,
                    ...user,
                    timestamp: Math.floor(Date.now() / 1000)
                }
            })
        return token
    }

    async snapshot(key: string, data: any){
        await  this.redisService.set(key, data)
    }
}
