import { Sequelize } from "sequelize";
import config from "../config/database.js";

const env = "development"; // Force development environment
const { url, ...dbConfig } = config[env];

const sequelize = new Sequelize(url, {
  ...dbConfig,
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ PostgreSQL connected & models synced!");
    return sequelize;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export default sequelize;
