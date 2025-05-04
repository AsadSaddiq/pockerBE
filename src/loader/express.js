import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import { unProtectedRouter } from "../routes/index.js";

async function expressLoader(app) {
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(helmet());

  app.use(
    cors({
      // origin: 'https://pockerapp.vercel.app', // Your frontend URL
      origin: "http://localhost:5173", // Your frontend URL
      credentials: true, // Required for cookies/auth
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );
  // const corsOptions = {
  //   origin: "*",
  //   credentials: true,
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  //   allowedHeaders: ["Content-Type", "Authorization"],
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  // };

  // app.use(cors(corsOptions));
  // app.options("*", cors(corsOptions));

  app.use("/", unProtectedRouter);
  // app.use("/", authenticate, protectedRouter);
}

export default expressLoader;
