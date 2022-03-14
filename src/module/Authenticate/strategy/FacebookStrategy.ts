import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor() {
      super({
        clientID: `${process.env.FB_CLIENT}`,
        clientSecret: `${process.env.FB_SECRET}`,
        callbackURL: "http://localhost:8081/metax/v1/auth/facebook/redirect",
        scope: "email",
        profileFields: ["emails", "name"],
      });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user: any, info?: any) => void,
    ): Promise<any> {
      const { id, name, emails } = profile;
      
      const info = {
        email: emails[0].value,
        name: name.givenName + " " + name.familyName,
        code: id,
      }

      const payload = {
        info,
        accessToken,
      };
  
      done(null, payload);
    }
}