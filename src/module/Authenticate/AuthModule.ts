import { HttpModule } from "@nestjs/axios"
import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { AuthController } from "./AuthController"
import { AuthService } from "./AuthService"
import { FacebookStrategy } from "./strategy/FacebookStrategy"
import { GoogleStrategy } from "./strategy/GoogleStrategy"
import { jwtConstants, JwtStrategy } from "./strategy/JwtStrategy"
import { LocalStrategy } from "./strategy/LocalStrategy"

const privateKey = `${jwtConstants.secret}`

@Module({
    imports: [ 
        HttpModule.register({
        timeout: 5000,
        maxRedirects: 3,
        }),
        JwtModule.register({
            privateKey: privateKey,
            signOptions: { expiresIn: '60m' },
            verifyOptions: {
                algorithms: ["HS256", "HS512"]
            }
        }),
        PassportModule
    ],
    providers: [AuthService, LocalStrategy, FacebookStrategy, GoogleStrategy, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}