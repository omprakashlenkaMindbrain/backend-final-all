import { Request,Response } from "express";
import { adminplanmodel } from "../models/adminplan.model";
import log from "../../utils/logger";


export  const adminplan = (req:Request,res:Response) =>{
    try {
      const {plan_name,plan_price}=req.body
      if(!plan_name){
       return res.status(404).json({msg:"plan name required"})
      }
      if(!plan_price){
        return res.status(404).json({msg:"plan price required"})
      }
      const  data = adminplanmodel.create(
        {
            plan_name,plan_price
        }
      )

      return res.status(404).json({msg:"admin plan cretae sucessfully !"})

    } catch (error) {
        log.error(error)
    }
}