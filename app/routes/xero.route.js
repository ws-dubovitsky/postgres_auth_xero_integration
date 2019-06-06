(function() {
  "use strict";

  const xero_service = require("../services/xero.service");

  module.exports = function(app) {
    app.get("/", xero_service.link);
    app.get("/connect", xero_service.connect);
    app.get("/callback", xero_service.callback);
  };
})();
