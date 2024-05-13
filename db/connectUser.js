import mongoose from "mongoose";

let isError = false;
const connectDB = async (url) => {

    try {
        const options = { dbName: process.env.DBNAME }
        const connection = await mongoose.connect(url, options);
        console.log('DataBase Connected....');
    } catch (error) {

        if(error) isError = true;
       
    }
}

export default connectDB;
export{isError};