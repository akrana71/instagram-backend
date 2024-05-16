import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async ()=> {
    try {
        
        mongoose.connection.on("connected", ()=> {
            console.log(`Databse connected successfully!`)
        })
        
        mongoose.connection.on("error", (err)=> {
            console.log(`Databse not connected, ${err}`)
        })
        
        await mongoose.connect(config.databaseUrl as string)
        
    } catch (error) {
        console.error(`Databse not connected, ${error}`)
        process.exit()
    }
}

export default connectDB