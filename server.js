const express = require('express');
const cors = require('cors');
require('dotenv').config();
const dbconnection=require('./Database/index');
const app = express();
const cookie_parser=require('cookie-parser');
app.use(express.json({
  limit:'16kb'
}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static('Public'));
app.use(cookie_parser());

const corsOptions = {
    origin: '*', 
    methods: ['GET','POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
};
app.use(cors(corsOptions));

//routes
const userRoutes = require('./Routes/user.routes');
app.use("/api/v1/users",userRoutes);

app.get('/',(req,res)=>{
   return res.json("welcome to SocialMedia Backend !!")
})

app.listen(process.env.PORT || 8085, () => {
  console.log(`Server is started on port: ${process.env.PORT || 8085}`);
});
