import userController from '../controllers/userController';
import express from 'express';

// Creating router instance of express router
const router = express.Router();

/*
   Creating Routes Api
*/

// user sign-up route
router.route('/register')
   .post(
      userController.register
   );

// user login route
router.route('/login')
   .post(
      userController.login
   );

// Route to get users
router.route('/users')
.get(
   userController.getUsers
);

module.exports = router;