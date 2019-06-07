const XeroClient = require("xero-node").AccountingAPIClient;
const config = require("../../config/xero.config.json");

let requestToken;
let xeroClient = new XeroClient(config);
// const axios = require("axios");

async function link(req, res) {
  res.send('<a href = "/connect">Connect to Xero </a>');
}

async function connect(req, res) {
  // You can initialise Private apps directly from your configuration

  // Create request token and get an authorisation URL
  requestToken = await xeroClient.oauth1Client.getRequestToken();
  console.log("requestToken", requestToken);
  // const { oauth_token, oauth_token_secret } = requestToken;
  let authoriseUrl = xeroClient.oauth1Client.buildAuthoriseUrl(requestToken);
  console.log("authoriseUrl", authoriseUrl);
  res.redirect(authoriseUrl);
}

//after
async function callback(req, res) {
  try {
    console.log("req.query", req.query);
    let oauth_verifier = req.query.oauth_verifier;
    console.log("oauth_verifier", oauth_verifier);
    let accessToken = await xeroClient.oauth1Client.swapRequestTokenforAccessToken(
      requestToken,
      oauth_verifier
    );

    console.log("accessToken", accessToken);
    let org = await xeroClient.organisations.get();

    // let invoices = await xeroClient.invoices.get();
    // console.log("invoices", invoices);

    // let lastInvoiceNumber = invoices.Invoices[0].InvoiceNumber;
    console.log("org", org);
    // console.log("lastInvoiceNumber", lastInvoiceNumber);
    res.send(org);
  } catch (err) {
    console.log("err", err);
    res.send(err);
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
