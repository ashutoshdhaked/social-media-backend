const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const dbUrl = process.env.DB_URL;
const port = process.env.PORT || 8085; 
const app = express();
app.use(express.json());

const corsOptions = {
    origin: '*', 
    methods: ['GET','POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
  };


app.use(cors(corsOptions));
app.get('/',(req,res)=>{
   return res.json("welcome to SocialMedia Backend !!")
})

mongoose.connect(dbUrl)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});


app.listen(port, () => {
  console.log(`Server is started on port: ${port}`);
});
