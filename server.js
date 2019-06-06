(function() {
  "use strict";

  // require("dotenv").config();
  const express = require("express");
  const app = express();
  const http = require("http");

  const cors = require("cors");
  const cookieParser = require("cookie-parser");
  const bodyParser = require("body-parser");
  const db = require("./config/database");

  // const { Pool, Client } = require("pg");
  // const connectionString = "postgressql://postgres:123@localhost:5432/postgres";

  // const pool = new Pool({
  //   user: "postgres",
  //   host: "localhost",
  //   database: "testbb",
  //   password: "123",
  //   port: 5432
  //   // connectionString: connectionString
  // });

  // Test DB

  (async () => {
    try {
      const db_authenticate = await db.authenticate();
      // console.log("db_authenticate", db_authenticate);
      console.log("database connected...");
    } catch (err) {
      console.log("Error: ", err);
    }
  })();


  // Option 2: Passing a connection URI
  // const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

  // pool.query("SELECT NOW()", (err, res) => {
  //   console.log(err, res);
  //   pool.end();
  // });

  // pool.on("connect", () => {
  //   console.log("connected to the db");
  // });

  // const client = new Client({
  //   connectionString: connectionString
  // });

  // client.connect();
  // client.query("SELECT NOW()", (err, res) => {
  //   if (err) {
  //     console.log("err", err);
  //     // res.status(400).send(err);
  //   } else {
  //     console.log("res", res);
  //   }
  //   client.end();
  // });

  // const fs = require("fs");

  // const config = require("./config/config.js");
  // const modelsPath = __dirname + "/app/models/";

  app.set(
    "port",
    process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000
  );
  app.set(
    "ipaddr",
    process.env.HOSTNAME || process.env.OPENSHIFT_NODEJS_IP || "localhost"
  );

  // fs.readdirSync(modelsPath).forEach(function(file) {
  //   require(modelsPath + "/" + file);
  // });

  app.use(cors());
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(
    bodyParser.json({
      limit: "50mb",
      extended: true
    })
  );
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true
    })
  );

  // app.configure(function() {
  //   app.use(express.bodyParser());
  //   app.use(app.router);
  // });
  // app.use("/assets", express.static("assets"));

  // app.use(require("./app/middleware/jwt.middlerware").jwtCheck);

  require("./app/routes/xero.route");
  require("./app/routes/user.route")(app);
  require("./app/routes/auth.route")(app);

  // app.use(require("./app/middleware/error.middleware").handleError);

  const httpServer = http.createServer(app);

  httpServer.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port"));
  });
})();
