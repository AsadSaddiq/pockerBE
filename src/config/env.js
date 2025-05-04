export const env = {
  port: process.env.PORT || 2022,
  // mongodbUri: process.env.DB_URI || "mongodb://127.0.0.1:27017/poker",
  mongodbUri:
    "mongodb+srv://asadryk2911:captan2911@cluster0.mkhskjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",

  jwtSecret: "my secrete token",
  DATABASE_URL:
    "postgres://neondb_owner:npg_uFE6WOG2Arai@ep-dark-voice-a5je71aw-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
  NODE_ENV: "development",
};
