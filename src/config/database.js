export default {
  development: {
    url: "postgres://neondb_owner:npg_uFE6WOG2Arai@ep-dark-voice-a5je71aw-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  },
};
