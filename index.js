const express = require("express");
require("dotenv").config();
const cors = require("cors");
const userRouter = require("./routes/userRoute");
const auth = require("./middlewares/auth");
const addressRouter = require("./routes/addressRoute");
const paymentRouter = require("./routes/paymentRoute");

const { json, urlencoded } = express;

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(auth);

app.use("/users",userRouter);
app.use("/address",addressRouter);

app.use("/payment",paymentRouter);

app.get("/success", (req,res) => {
  res.send("Payment Successfull")
})
app.get("/cancel", (req,res) => {
  res.send("Payment Failed")
})

app.listen(process.env.PORT, () =>
  console.log("server listening at port " + process.env.PORT)
);
