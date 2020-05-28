import bcrypt from 'bcryptjs';
import {
   Strategy as JwtStrategy
} from 'passport-jwt';
import {
   ExtractJwt as ExtractJwt
} from 'passport-jwt';
import config from '../config/';
import User from '../models/userModel';


var ex = function(passport) {

   let opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.secret,
      ignoreExpiration: false,
      algorithms: ['HS256']
   };
   passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById({
         _id: jwt_payload.id
      }, (err, user) => {
         if (err) {
            return done(err, false);
         }
         if (user) {
            done(null, user);
         } else {
            done(null, false);
         }
      });
   }));
}


module.exports = ex;