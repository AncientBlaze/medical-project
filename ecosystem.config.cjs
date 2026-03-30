require('dotenv').config();

module.exports = {
  apps: [
    {
      name: "backend",
      script: "./backend/server.js",
      interpreter: "node",
      env: {
        ...process.env,
        NODE_ENV: "development"
      },
      env_production: {
        ...process.env,
        NODE_ENV: "production"
      }
    },
  ],
};
