  /*
  * Basic configuration object
  */

 import dotenv from 'dotenv';
 dotenv.config();
 var url = 'http://localhost:3000';

 module.exports = {
    url,
    auth: {
       secret: 'my_secret_key',
       session_secret: "backend_api_secret"
    },
    smtpConfig: {
       host: 'smtp.gmail.com',
       port: 465,
       secure: true, // use SSL
       auth: {
          user: '',
          pass: '',
       }
    }
 };
