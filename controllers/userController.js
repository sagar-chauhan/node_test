import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import validations from '../helpers/userHelper';
import jwt from 'jsonwebtoken';
import config from '../config/';
import randtoken from 'rand-token';

randtoken.generate();

let user = {

   /*
    * Handle user registration process.
    * 1. Check if user is already registered by checking email
    * 2. Encrypt password
    * 3. Save user information in MongoDB
    */
   register(req, res, next) {
      const { fullName, email, password } = req.body;
      let hashedPassword;

      if (validations.emailValidation(email) == !true) {
         return res.status(400)
            .json({
               status: false,
               message: 'Email cannot be empty & should be valid format'
            });
      } else if (password) {
         User.findOne({
            email
         }, (err, user) => {
            if (err) {
               return res.status(400).json({
                  status: false,
                  message: 'Error on finding user'
               });
            }
            if (user && user.email === email) {
               return res.status(200).json({
                  status: false,
                  message: 'This email is already registered'
               });
            }
            bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(password, salt, (err1, hash) => {
                  if (err1) {
                     return res.status(400).json({
                        status: false,
                        message: 'Error on Hashing Password',
                        error: err1.message
                     });
                  }
                  hashedPassword = hash;

                  let newUser = new User({
                     'fullName': fullName,
                     'email': email,
                     'password': hashedPassword,
                  });
                  newUser.save((err, theUser) => {
                     if (err) {
                        res.status(500).json({
                           message: 'Something went wrong.Try again.',
                           error: err.message
                        });
                     } else {
                        res.status(201).json({
                           status: true,
                           message: "User have been successfully created",
                           user: theUser
                        })
                     }
                  });
               });
            });
         });
      } else {
         return res.status(400).json({
            status: false,
            message: "Password cannot be empty"
         });
      }
   },

   /**
    * Handle user login process via Passport-jwt
    * 1. Check user email in the database.
    * 2. Encrypt password and compare with saved password.
    * 3. Generate a token using JWT for authentication
    **/
   login(req, res, next) {

      let email = req.body.email;
      let password = req.body.password;

      if (validations.emailValidation(email) == !true) {
         return res.status(400)
            .json({
               status: false,
               message: 'Email cannot be empty & should be valid format'
            });
      } else if (password) {
         User.findOne({
            email: email
         }, function (err, user) {
            if (err) {
               res.status(500).json({
                  status: false,
                  error: err.message
               });
            }
            if (!user) {
               res.status(401).json({
                  success: false,
                  message: 'Authentication failed'
               });
            } else {
               bcrypt.compare(password, user.password, function (err, isMatch) {
                  if (!isMatch) {
                     return res.status(400).json({
                        status: false,
                        message: "Authentication failed"
                     });
                  } else {
                     var payload = {
                        id: user._id,
                        fullName: user.fullName,
                        email: user.email
                     };
                     if (isMatch && !err) {
                        var token = jwt.sign(payload, config.auth.secret, {
                           expiresIn: '1d'
                        });
                        res.status(200).json({
                           success: true,
                           message: 'Authentication successfull',
                           token
                        });
                     } else {
                        res.status(400).json({
                           success: false,
                           message: 'Password not matched..!!!'
                        });
                     }
                  }
               });
            }
         });
      } else {
         res.status(400).json({
            status: false,
            message: "Password cannot be empty"
         });
      }
   },

 /**
   * Handle get user Request
   Get all user from database
**/
   async getUsers(req, res, next) {
      try {
         var users = await User.find({});
         if (!user) {
            return res.status(500).json({
               status: false,
               message: 'No data found',
            });
         } else {
            return res.status(200).json({
               status: true,
               message: "All users",
               user: users
            });
         }
      }
      catch (err) {
         res.status(500).json({
            status: false,
            error: err.message
         })
      }
   },
}


export default user;