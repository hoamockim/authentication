import { Controller, Header, Post, Scope, HttpStatus, Body, Get, UseGuards, Req, Res } from "@nestjs/common"
import { MessagePattern, Payload, Transport } from "@nestjs/microservices"
import { AuthGuard } from "@nestjs/passport"
import { map, Observable } from "rxjs"
import { Route } from "../../route"
import { StringUtil } from "../../util"
import { AuthService } from "./AuthService"
import { AuthType } from "./AuthType"
import { ResponseDto, SignUpRequestBody } from "./dtos"
import { ResultType, ServiceResult } from "./ServiceResult"

@Controller({
    path:  Route.URLV1 + 'auth',
    scope: Scope.REQUEST
})
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    @Get("/health-check")
    async healtcheck(): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
        }
    }
    
    @Get("/facebook/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: any, @Res() res: any){
        if (!req.user) {
            return ResponseDto.error(HttpStatus.UNAUTHORIZED, "cannot auth with facebook account")
        }
        const token = await this.authService.generateToken(req.user.info, AuthType.Facebook)
        res.redirect(`${process.env.APP_URL}?token=${token}`)
    }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: any) {
        if (!req.user) {
            return ResponseDto.error(HttpStatus.UNAUTHORIZED, "cannot auth with google account")
        }
        const token = await this.authService.generateToken(req.user.info, AuthType.Google)
        res.redirect(`${process.env.APP_URL}?token=${token}`)
    }

    @UseGuards(AuthGuard('local'))
    @Post("/signin")
    signIn(@Req() req){
        const rs = req.user as Observable<ServiceResult>
        return rs.pipe(map(
            async (value) => 
            {
                if (( value.type as ResultType) ==  ResultType.Error ) {
                    return ResponseDto.error(HttpStatus.UNAUTHORIZED, value.message)
                }
                
                const token = await this.authService.generateToken(value.data.data, AuthType.Email)
                return ResponseDto.success({accessToken: token})
            }
        ))
    }

    @Post("/signup")
    @Header('Content-Type', 'application/json')
    async signUp(@Body() req: SignUpRequestBody){
        if (!StringUtil.isValidEmail(req.email) || !StringUtil.isValidPassWord(req.password)) {
            return ResponseDto.error(HttpStatus.BAD_REQUEST, "data invallid")
        }
        await this.authService.signUp(req)
        return ResponseDto.success({email: req.email, register_status: "waiting active"})
    }

    @MessagePattern("metax.account_status.event", Transport.KAFKA)
    async consumSignUpEvent(@Payload()message: any){
        const data = message.value.payload.data
        if (data.usercode) {
            this.authService.snapshot(`metax:usercode:${data.usercode}` , {activeCode: data.activecode, status: data.isActive})
        }
    }
}