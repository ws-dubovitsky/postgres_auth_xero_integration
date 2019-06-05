const XeroClient = require("xero-node").AccountingAPIClient;
const config = require("../config/xero.config.json");

async function App(req, res) {
  let requestToken;
  // You can initialise Private apps directly from your configuration
  let xero = new XeroClient(config);
  // Create request token and get an authorisation URL
  requestToken = await xero.oauth1Client.getRequestToken();

  const { oauth_token, oauth_token_secret } = requestToken;
  // console.log("Received Request Token:", requestToken);

  let authUrl = xero.oauth1Client.buildAuthoriseUrl(requestToken);
  // console.log("Authorisation URL", authUrl);

  const oauth_verifier = 123456;
  const savedRequestToken = {
    oauth_token,
    oauth_token_secret
  };

  // console.log("savedRequestToken", savedRequestToken);

  const accessToken = await xero.oauth1Client.swapRequestTokenforAccessToken(
    savedRequestToken,
    oauth_verifier
  );
  console.log("Received Access Token:", accessToken);

  // const result = await xero.invoices.get();
  // console.log("Number of invoices:", result.Invoices.length);

  // const result = await xero.invoices.get();
  // console.log("Number of invoices:", result.Invoices.length);
}

module.exports = {
  App
};
