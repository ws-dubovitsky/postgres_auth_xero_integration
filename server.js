(function() {
  "use strict";

  // require("dotenv").config();
  const express = require("express");
  const app = express();
  const http = require("http");
  const cors = require("cors");
  const cookieParser = require("cookie-parser");
  const bodyParser = require("body-parser");
  const exphbs = require('express-handlebars');
  const db = require("./config/database");
  // const modelss = require('./config/schema/index')

  const busboy = require("connect-busboy");
  const busboyBodyParser = require("busboy-body-parser");

  app.use(function(req, res, next) {
    let responseSettings = {
      AccessControlAllowOrigin: req.headers.origin,
      AccessControlAllowHeaders:
        "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
      AccessControlAllowMethods: "POST, GET, PUT, DELETE, OPTIONS",
      AccessControlAllowCredentials: true
    };
    res.header(
      "Access-Control-Allow-Credentials",
      responseSettings.AccessControlAllowCredentials
    );
    res.header(
      "Access-Control-Allow-Origin",
      responseSettings.AccessControlAllowOrigin
    );
    res.header(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"]
        ? req.headers["access-control-request-headers"]
        : "x-requested-with"
    );
    res.header(
      "Access-Control-Allow-Methods",
      req.headers["access-control-request-method"]
        ? req.headers["access-control-request-method"]
        : responseSettings.AccessControlAllowMethods
    );
    if (req.method === "OPTIONS") {
      res.send(200);
    } else {
      next();
    }
  });

  // Test DB
  (async () => {
    try {
      await db.authenticate();
      // await models.async({})
      console.log("database connected...");
    } catch (err) {
      console.log("Error: ", err);
    }
  })();

  // const fs = require("fs");

  // const config = require("./config/config.js");
  // const modelsPath = __dirname + "/app/models/";

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(busboy());
  app.use(busboyBodyParser());
  // app.use(bodyParser.json());

  app.engine("handlebars", exphbs({ defaultLayout: "main" }));
  app.set("view engine", "handlebars");

  app.set(
    "port",
    process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000
  );
  app.set(
    "ipaddr",
    process.env.HOSTNAME || process.env.OPENSHIFT_NODEJS_IP || "localhost"
  );

  app.set("port", process.env.PORT || 5000);

  // fs.readdirSync(modelsPath).forEach(function(file) {
  //   require(modelsPath + "/" + file);
  // });

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

  // app.use(require("./app/middleware/jwt.middlerware").jwtCheck);

  // routes
  require("./app/routes/xero.route")(app);
  require("./app/routes/user.route")(app);
  require("./app/routes/auth.route")(app);

  // app.use(require("./app/middleware/error.middleware").handleError);

  const httpServer = http.createServer(app);

  // models.sequelize.sync({}).then((res) => {
  //   console.log('res', res)
  //   console.log("connected");
  //   app.listen(app.get("port"));
  // });

  httpServer.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port"));
  });
})();
