const asyncHandler =require('../Utilities/asyncHandler');
const {ApiError}=require('../Utilities/ApiError');
const User =require('../Modals/user.model')
const {ApiResponse} =require('../Utilities/ApiResponse');
const { options } = require('../Routes/user.routes');
const jwt =require("jsonwebtoken");

const registerUser =asyncHandler( async(req,res)=>{
    //get user details from request
    const {name,email,password,confirmPassword,dob,phone,gender} = req.body;
    //validate request data
    if([name,email,password,dob,phone,gender].some((field)=> field?.trim()==='')){
        throw new ApiError(400, 'All fields are manadatory!!');
    }
   
    if(!/\S+@\S+\.\S+/.test(email)){
        throw new ApiError(400, 'Invalid email!!');
    }if(password.length < 8){
        throw new ApiError(400, 'Password must be at least 8 characters long!!');
    }if(!/^\d{10}$/.test(phone)){
        throw new ApiError(400, 'Invalid phone number!!');
    }
    if(password !== confirmPassword){
        throw new ApiError(400, 'Password and confirm password should be same!');
    }
    //check if user already exists
    const user = await User.findOne({email});
    if(user){
        throw new ApiError(409, 'User already exists!!');
    }
    //create user
    const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        dob,
        phone,
        gender,
        password
    });
    
    const modifiedUser = await User.findById(newUser._id).select("-password -refreshToken");

    return res.status(201).json(new ApiResponse(200, modifiedUser, "User registered successfully!!"));
    
})


const loginUser = asyncHandler(async(req,res)=>{
    //get email and password from request
    const {email,password} = req.body;
    //validate data
    if(!/\S+@\S+\.\S+/.test(email)){
        throw new ApiError(400, 'Invalid email!!');
    }
    if(password.length < 8){
        throw new ApiError(400, 'Password must be at least 8 characters long!!');
    }
    //check if user exists
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404, 'User not found!!');
    }
    //check if password is correct
    const isPasswordCorrect = await user.isCorrectPassword(password)
    if(!isPasswordCorrect){
        throw new ApiError(401, 'Invalid user credentials');
    }

    //generate tokens
    const accesstoken =await user.generateAccessToken();
    const refreshToken =await user.generateRefreshToken();

    user.refreshToken =refreshToken;
    await user.save({validateBeforeSave:false});
    modifiedUser=await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly:true,
        secure:true,
    }

    return res.status(200)
    .cookie("accessToken", accesstoken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {accessToken:accesstoken, refreshToken:refreshToken,user:modifiedUser}, "User logged in successfully!!"));
})

const logoutUser =asyncHandler(async(req,res)=>{

    
  const result= await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken:null
        }
    },
    {
        new:true
    })
    const options = {
        httpOnly:true,
        secure:true,
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie(',refreshToken',options)
    .json(new ApiResponse(200,{},"User is logged out!"))

})

const refreshAccessToken = asyncHandler(async(req,res)=>{

    const cookieRefreshToken =req.cookies.refreshToken || req.body.refreshToken;   
    if(!cookieRefreshToken){
        throw new ApiError(401,"Unauthorised request");
    }
    const decodedToken=jwt.verify(cookieRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    const user =await User.findById(decodedToken?._id);
    if(!user){
        throw new ApiError(401,"Invalid refresh token");
    }
    if(cookieRefreshToken !== user?.refreshToken){
        throw new ApiError(401,"Refresh token is expired!");
    }
    //generate tokens
    const accesstoken =await user.generateAccessToken();
    const refreshToken =await user.generateRefreshToken();

    user.refreshToken =accesstoken;
    await user.save({validateBeforeSave:false});
    modifiedUser=User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly:true,
        secure:true,
    }
    return res.status(200)
    .cookie("accessToken", accesstoken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,{
            accesstoken:accesstoken,
            refreshToken:refreshToken
        },
        "Access token refreshed!"))
})

module.exports ={registerUser,loginUser,logoutUser,refreshAccessToken};