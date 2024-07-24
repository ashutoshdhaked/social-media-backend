const mongosh=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const userSchema = new mongosh.Schema(
    {

    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        index:true,
    },
    phone:{
        type:Number,
        required:true,
        trim:true,

    },
    gender:{
        type:String,
        required:true,
        trim:true,
    },
    dob:{
        type:Date,
        required:true,
        trim:true,

    },
    avtar:{
        type:String,
        default:null
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    refreshToken:{
        type:String
    }
    },
    {
        timestamps:true,
    }
);

userSchema.pre(method="save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isCorrectPassword = async function (password){
    return bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken= async function(){
    return jwt.sign({
        _id:this._id,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
    
}

userSchema.methods.generateRefreshToken= async function(){
   return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}
const User = mongosh.model('User',userSchema);
module.exports = User;