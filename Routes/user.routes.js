const app =require('express')

const Router =app.Router();
const {registerUser,loginUser,logoutUser,refreshAccessToken} =require('../Controllers/user.controller');
const { verifyJWT } = require('../Middlewares/auth.middleware');

Router.route("/register").post(registerUser);
Router.route("/login").post(loginUser);
Router.route("/refresh-access-token").post(refreshAccessToken)

//secured routes
Router.route('/logout').post(verifyJWT,logoutUser);


module.exports =Router;