import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected!! at ${connectionInstance.connection.host} on port ${connectionInstance.connection.port}`);
        // console.log(connectionInstance.connection)
        
    } catch (err) {
        console.log(`connection Failed with ${err}`);
        process.exit(1);
    }
};

export default connectDB;