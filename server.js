(function() {
  "use strict";

  require("dotenv").config();
  const express = require("express");
  const http = require("http");
  const fs = require("fs");
  const cors = require("cors");
  const mongoose = require("mongoose");
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

  const mainDB = mongoose.createConnection(config.db_main, {
    useNewUrlParser: true
  });
  mainDB.on("error", function(err) {
    if (err) {
      console.log("MainDB");
      console.log(err);
    }
  });
  mainDB.once("open", function callback() {
    console.info("CLIENT DB connected successfully");
  });

  module.exports = {
    main: mainDB
  };

  app.use(require("./app/middleware/jwt.middlerware").jwtCheck);

  //default create admin
  require("./app/routes/auth.route")(app);

  //create role for user
  require("./app/routes/role.route")(app);

  app.use(require("./app/middleware/error.middleware").handleError);

  const httpServer = http.createServer(app);

  httpServer.listen(app.get("port"), function() {
    console.log("Magic happens on port " + app.get("port"));
  });
})();
