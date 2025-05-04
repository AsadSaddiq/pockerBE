import express from "express";
import loader from "./loader/index.js";
import config from "./config/index.js";

async function startServer() {
  const app = express();

  await loader(app);

  const server = app.listen(config.env.port, () => {
    console.log(`app is running on http://localhost:${config.env.port} 😎`);
  });
  process.on("uncaughtException", (err) => {
    console.log("uncaughtException! Shutting Down the Server...");
    console.log(err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    console.log("unhandledRejection! Shutting Down the Server...");
    console.log(err);
    server.close(() => {
      process.exit(1);
    });
  });
}
startServer();
