const XeroClient = require("xero-node").AccountingAPIClient;
const config = require("../../config/xero.config.json");
// const axios = require("axios");

async function link(req, res) {
  res.send('<a href = "/connect">Connect to Xero </a>');
}

async function connect(req, res) {
  let requestToken;
  // You can initialise Private apps directly from your configuration
  let xero = new XeroClient(config);
  // Create request token and get an authorisation URL
  requestToken = await xero.oauth1Client.getRequestToken();
  // const { oauth_token, oauth_token_secret } = requestToken;
  let authUrl = xero.oauth1Client.buildAuthoriseUrl(requestToken);
  res.redirect(authUrl);
}

async function callback(req, res) {
  try {
    let oauth_verifier = req.body.oauth_verifier;
    console.log("oauth_verifier", oauth_verifier);
    let accessToken = await xero.oauth1Client.swapRequestTokenforAccessToken(
      requestToken,
      oauth_verifier
    );
    console.log("accessToken", accessToken);
    let org = await xero.organisation.get();
    console.log("org", org);
    res.status(200).send(org);
  } catch (err) {
    console.log("err", err);
    res.status(400).send(err);
  }
}

// async function App(req, res) {

// console.log("Received Request Token:", requestToken);

// console.log("Authorisation URL", authUrl);
// const oauth_verifier = 123456;
// const savedRequestToken = {
//   oauth_token,
//   oauth_token_secret
// };

// const url = "https://api.xero.com/api.xro/2.0/Accounts";

// const newAccount = axios.put(url);

// console.log("savedRequestToken", savedRequestToken);
// }

module.exports = {
  link,
  connect,
  callback
};
