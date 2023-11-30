const pkg = require("../../package.json");
const environment = process.env.ELEVENTY_ENV;
const DEV_ENV = "dev";
const devUrl = "http://localhost:8080";
const prodUrl = "https://www.sarahwilsondsm.org";

let isProd = false;
let url;

if (environment === DEV_ENV) {
  url = devUrl;
} else {
  url = prodUrl;
  isProd = true;
}

module.exports = {
  environment,
  isProd,
  url,
  recaptchaSiteKey: "",
  pkgVersion: pkg.version,
};
