import { Request,Response,NextFunction } from "express";

import { ZodObject, ZodRawShape } from "zod";

// Define AnyZodObject manually
type AnyZodObject = ZodObject<ZodRawShape>;
//below function is an example of currying 
const validate=(schema: AnyZodObject)=>(req:Request ,res:Response ,next:NextFunction)=>{

    try{
        schema.parse({
            body:req.body,
            query:req.query,
            params:req.params
        });
        next();


    }catch(e: any){
        return res.status(400).send(e.message);

    }


};

export default validate; 