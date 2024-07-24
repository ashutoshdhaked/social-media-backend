const mongose=require('mongoose');

const dburl=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=social-media-app`

mongose.connect(dburl)
.then(()=>{
    // const db=mongose.connection;
    // db.on('error',console.error.bind(console,"failed to connect with db"));

    // db.once('open',function(){
    //     console.log("succesfully connected to the database");
    // })

    console.log("connected to db");
})
.catch((err)=>{
    console.log("Error while connection to DB",err);
})


const db=mongose.connection;




