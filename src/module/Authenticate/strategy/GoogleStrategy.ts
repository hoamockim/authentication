
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_SECRET}`,
      callbackURL: 'http://localhost:8081/metax/v1/auth/google/redirect',
      scope: ['email','profile'],
    })
  }

  async validate (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const { id, emails, name } = profile
    const info = {
      code: id,
      email: emails[0].value,
      name: name.givenName + " " + name.familyName
    }
    
    const payload = {
      info, 
      accessToken
    }
    done(null, payload)
  }
}