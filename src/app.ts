import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import connectDB from "./utils/connect";
import logger from "./utils/logger";

// Routers
import Adminroutes from "./Admin/routes/routes";
import userRouter from "./User/routes/routes";
import { kycrouter } from "./kyc/routes/kyc.routes";
import { planrouter } from "./plan/routes/plan.routes";

// Middlewares
import deserializeAdmin from "./Admin/middlewares/deserializeAdmin";
import deserializeUser from "./User/middlewares/deserializeUser";

const app = express();
const port = config.get<number>("port");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);



// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://beta-gfklo7wgr-omprakashlenkamindbrains-projects.vercel.app"
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Correct order — these run before routes
app.use(deserializeUser);
app.use(deserializeAdmin);

// ✅ Mount routes
app.use("/", Adminroutes);
app.use("/", userRouter);
app.use("/", kycrouter);
app.use("/", planrouter);

app.listen(port, async () => {
  await connectDB();
  logger.info(`🚀 Server running at http://localhost:${port}`);
});
