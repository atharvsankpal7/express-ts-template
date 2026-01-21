import { eq } from "drizzle-orm"
import { PassportStatic } from "passport"
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions, VerifiedCallback } from "passport-jwt"

import { db } from "../drizzle/drizzle"
import { users } from "../drizzle/schemas/users.schema"
import Config from "./index"
interface JwtPayload {
  id: number
  email: string
  iat?: number
  exp?: number
}
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Config.JWT_SECRET,
}
export default (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(jwtOptions, (payload: JwtPayload, done: VerifiedCallback) => {
      db.select()
        .from(users)
        .where(eq(users.id, payload.id))
        .limit(1)
        .then(([user]) => {
          if (user) {
            return done(null, user)
          }
          return done(null, false)
        })
        .catch((err) => {
          return done(err, false)
        })
    }),
  )
}
