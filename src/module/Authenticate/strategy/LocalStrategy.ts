import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local"
import { AuthService } from "../AuthService"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService){
        super({ usernameField: 'email' });
    }

     validate(email: string, password: string): any{
        return this.authService.validate(email, password)
    }
}