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

  // Test DB
  (async () => {
    try {
      await db.authenticate();
      console.log("database connected...");
    } catch (err) {
      console.log("Error: ", err);
    }
  })();

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
  app.use(bodyParser.urlencoded({ extended: false }));
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

  // app.use(require("./app/middleware/jwt.middlerware").jwtCheck);

  // routes
  require("./app/routes/xero.route")(app);
  require("./app/routes/user.route")(app);
  require("./app/routes/auth.route")(app);

  // app.use(require("./app/middleware/error.middleware").handleError);

  const httpServer = http.createServer(app);

  httpServer.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port"));
  });
})();
