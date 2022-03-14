import { AuthType } from "../AuthType"

export class SignInRequestBody {
    email: string
    password: string
    authType: AuthType
}

export class SignUpRequestBody {
    authType: AuthType
    email: string
    password: string
    accessToken?: string
} 
