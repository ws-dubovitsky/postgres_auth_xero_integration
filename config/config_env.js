module.exports = {
  db_main: process.env.DB_MAIN || "mongodb://localhost/Peasy",
  JWT_KEY: process.env.JWT_KEY || "fpeijf83KFWEN#@KGYUIINEo3hr3jeruerioewrh3",
  EMAIL_SERVICE_LOGIN:
    process.env.EMAIL_SERVICE_LOGIN || "queensbeansbot@gmail.com",
  EMAIL_SERVICE_PASSWORD:
    process.env.EMAIL_SERVICE_PASSWORD || "queensbeansbot2260!",
  EMAIL_CLIENT_URL: process.env.EMAIL_CLIENT_URL || "http://localhost:3000",

  API_URL: process.env.API_URL || "http://localhost:5000"
};
