const express = require("express");
const app = express();
const cors = require("cors");
const api_helper = require("./API_helper");

app.use(express.json({ extended: false }));
app.use(cors());
//Home page message
// app.get("/", (req, res) => res.json({ msg: "Welcome" }));

// app.get("/test", (req, res) => {
//   // API code will be here
//   api_helper
//     .make_API_call("https://prod.acp.adobeoobe.com/heartbeat")
//     .then((response) => {
//       res.json(response);
//     })
//     .catch((error) => {
//       res.send(error);
//     });
// });
app.use("/ipo", require("./routes"));

// app.get("/hi", (req, res) => {
//   // API code will be here
//   const headers = {
//     "content-type": "application/json", // <--Very important!!!
//   };

//   api_helper
//     .make_API_call1(
//       "https://linkintime.co.in/ipo/IPO.aspx/GetDetails",
//       "post",
//       headers
//     )
//     .then((response) => {
//       res.json(response);
//     })
//     .catch((error) => {
//       res.send(error);
//     });
// });

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
