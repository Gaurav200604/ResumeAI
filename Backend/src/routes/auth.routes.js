const { Router } = require('express');
const authRouter = Router();
const authMiddleware = require('../middlewares/auth.middleware');


const authController = require('../controllers/auth.controller');


/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post('/register', authController.registerUserController);  

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */

authRouter.post('/login', authController.loginUserController);


/**
 *@route POST /api/auth/logout
 *@description Logout a user
 *@access Public
 */ 

authRouter.post('/logout', authController.logoutUserController);


/**
 * @route GET /api/auth/get-me
 * @description Get the current logged-in user
 * @access Private
 */

authRouter.get('/get-me',authMiddleware.authUser, authController.getMeController);


module.exports = authRouter;
