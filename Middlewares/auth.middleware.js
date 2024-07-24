const User = require("../Modals/user.model");
const { ApiError } = require("../Utilities/ApiError");
const asyncHandler = require("../Utilities/asyncHandler")
const jwt =require('jsonwebtoken');

const verifyJWT =asyncHandler(async(req,res,next)=>{
  try {
    const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ",'');
    if(!token){
        throw new ApiError("401","Unauthorised Token!");
    }

    const decodedtoken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET); 
    const user =await User.findById(decodedtoken?._id).select("-password -refreshToken");
    if(!user){
        throw new ApiError('401',"Invaid Access Token!")
    }
    req.user=user;
    next();
  } catch (error) {
    throw new ApiError(401,error?.message || "Invalid access token!")
  }
})



module.exports ={verifyJWT}