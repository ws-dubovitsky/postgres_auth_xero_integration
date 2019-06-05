(function() {
  "use strict";

  require("dotenv").config();
  const express = require("express");
  const http = require("http");
  const fs = require("fs");
  const cors = require("cors");
  const cookieParser = require("cookie-parser");
  const bodyParser = require("body-parser");
  const config = require("./config/config.js");
  const modelsPath = __dirname + "/app/models/";

  const app = express();

  app.set(
    "port",
    process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000
  );
  app.set(
    "ipaddr",
    process.env.HOSTNAME || process.env.OPENSHIFT_NODEJS_IP || "localhost"
  );

  fs.readdirSync(modelsPath).forEach(function(file) {
    require(modelsPath + "/" + file);
  });

  app.use(cors());
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
  app.use("/assets", express.static("assets"));

  app.use(require("./app/middleware/jwt.middlerware").jwtCheck);

  require("./app/routes/xero.route")(app);

  app.use(require("./app/middleware/error.middleware").handleError);

  const httpServer = http.createServer(app);

  httpServer.listen(app.get("port"), function() {
    console.log("Magic happens on port " + app.get("port"));
  });
})();
