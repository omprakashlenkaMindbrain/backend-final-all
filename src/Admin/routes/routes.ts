import express from 'express';
import { uploader } from "../../utils/upload";
import { editQrHandler, getQrComtroller, setQrHandler } from "../controller/qr.controller";
import { createAdminSessionHandler, deleteSessionHandler, getAdminSessionsHandler, getAllUsersWithKycAndPlan, updateKycStatus } from "../controller/session.controller";
import { createAdminHandler } from '../controller/user.controller';
import { requireAdmin } from "../middlewares/requiredAdmin";
import validateResorces from "../middlewares/validateResource";
import { createAdminSchema } from "../schema/admin.schema";
import { createSessionSchema } from '../schema/session.schema';
const Adminroutes = express.Router()

    Adminroutes.post('/api/admin',validateResorces(createAdminSchema),createAdminHandler)
    Adminroutes.post('/admin/sessions',validateResorces(createSessionSchema),createAdminSessionHandler)
    Adminroutes.get('/admin/sessions', requireAdmin ,getAdminSessionsHandler);
    Adminroutes.delete("/admin/sessions", requireAdmin, deleteSessionHandler);
    Adminroutes.get("/user/Alldetails",getAllUsersWithKycAndPlan)
    Adminroutes.put("/admin/kyc/update/:id",requireAdmin,updateKycStatus)

    //for upload qr
    Adminroutes.post('/admin/session/qr',requireAdmin,uploader.single('qr'),setQrHandler)
    // Adminroutes.post('/admin/session/qr',uploader.single('qr'),setQrHandler)
   Adminroutes.put('/admin/session/qr-edit',requireAdmin,uploader.single("qr"),editQrHandler)
//    Adminroutes.put('/admin/session/qr-edit',uploader.single("qr"),editQrHandler)
   Adminroutes.get('/admin/qr',getQrComtroller)
   
export default Adminroutes;
