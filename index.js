const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { json, urlencoded } = express;

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));

app.listen(process.env.PORT, () =>
  console.log("server listening at port " + process.env.PORT)
);
