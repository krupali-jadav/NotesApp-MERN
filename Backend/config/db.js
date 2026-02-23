const mongoode = require('mongoose');

const connectDB= async()=>{
    try{
        await mongoode.connect(process.env.MONGO_URL);
        console.log("mongo connected successfully");
    }
    catch(error){
        console.error("mongodb connection failes",error.massage)
        process.exit(1)
    }
}
module.exports= connectDB;