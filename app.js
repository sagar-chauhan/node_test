import express from 'express'; // import express module
import mongoose from 'mongoose'; // import mongoose module
import bodyParser from 'body-parser'; // import body-parser module
import passport from 'passport'; // import express passport
import config from './config/';
import logger from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import session from 'express-session';
const MongoStore = require('connect-mongo')(session);

dotenv.config();
// import All routes  from routes folder
import Routes from './routes';

// Create a new Express Instance
const app = express();

// compress all responses
app.use(compression());

// Configuration and connecting to Databse MongoDb
var uri = 'mongodb://localhost/node';
mongoose.connect(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true
}, (err) => {
   if (err) {
      console.log(`Connection Error: ${err}`);
   } else {
      console.log('Successfully Connected');
   }
});

mongoose.Promise = global.Promise;

//body-parser middleware to handle form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

//morgan middle-ware to logs the requests.
app.use(logger('dev'));

//configuration for passport
require('./config/passport')(passport);
app.use(session({
   resave: false,
   proxy: true,
   saveUninitialized: true,
   secret: config.auth.session_secret,
   cookie: {
      secure: false,
      domain: 'localhost',
      maxAge: 1000 * 60 * 24 // 24 hours
   },
   store: new MongoStore({
      url: uri,
      autoReconnect: true
   })
}));

app.use(passport.initialize());
app.use(passport.session()); //persistent login session

// Welcome Route for api
app.get('/api', function (req, res, next) {
   res.status(200).json({
      status: true,
      message: "Welcome to Node API, Ready to Handle Requests..!!"
   });
});

// Api Routes For application
app.use('/api', Routes.userRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
   var err = new Error("No Matching Route Please Check Again...!!");
   err.status = 404;
   next(err);
});
// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
   res.status(err.status || 500);
   res.json({
      Error: {
         message: err.message
      }
   });
});

module.exports = app;