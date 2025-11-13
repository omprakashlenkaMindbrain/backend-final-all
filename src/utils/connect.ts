import mongoose from "mongoose";
import config from "config";
import logger from './logger';
 async function connectDB(){
    const dbURL = config.get<string>("dbURL");
    return mongoose.connect(dbURL).then(()=>{
        logger.info("Connected to DB");
    }).catch((e:any)=>{
    logger.error("could not connect "+e.message);
    process.exit(1);
    })
}

export default connectDB;