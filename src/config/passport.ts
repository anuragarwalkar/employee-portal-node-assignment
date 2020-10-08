import { Strategy } from 'passport-google-oauth20';
import { PassportStatic } from 'passport';
import UserModel from '../models/user';
const { GOOGLE_CLIENT_ID: clientID, GOOGLE_CLIENT_SECRET: clientSecret } = process.env as any;

export default function (passport: PassportStatic) {
  passport.use(
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const { sub: googleId, name: fullName, given_name,
          family_name, picture, email
        } = profile._json;

        const username = `${given_name}${family_name}`

        const newUser = {
          googleId, fullName, username,
          picture, email
        }

        try {
          const existingUser = await UserModel.findOne({ googleId }).lean();

          if (existingUser) {
            done(undefined, existingUser)
          } else {
            const createdUser: any = await UserModel.create(newUser)
            done(undefined, createdUser)
          }

        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  passport.serializeUser((user: any, done: any) => {
    done(null, user._id)
  })

  passport.deserializeUser((id: string, done: any) => {
    UserModel.findById(id, (err: any, user: any) => done(err, user))
  })
}
