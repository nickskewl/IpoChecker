const express = require("express");
var router = express.Router();
var request = require("request");
const xml2js = require("xml2js");

router.get("/", (req, res) => {
  request(
    {
      rejectUnauthorized: false,
      uri: "https://linkintime.co.in/ipo/IPO.aspx/GetDetails",
      method: "POST",
      headers: {
        "content-type": "application/json", // <--Very important!!!
      },
    },
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // console.log(JSON.parse(body).d);

        let output;
        xml2js.parseString(
          JSON.parse(body).d,
          { explicitArray: false },
          function (err, result) {
            output = result.NewDataSet.Table;
          }
        );

        res.json(output);
      } else {
        res.json(error);
      }
    }
  );
});

router.post("/", (req, res) => {
  // console.log(req.body.clientid);
  const { clientid, PAN, key_word } = req.body;

  const payload = { clientid: clientid, PAN: PAN, key_word: key_word };
  // console.log(payload);
  request(
    {
      rejectUnauthorized: false,
      uri: "https://linkintime.co.in/MIPO/IPO.aspx/SearchOnPan",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // console.log(body);
        res.json(body);
      } else {
        res.json(error);
      }
    }
  );
});

module.exports = router;
