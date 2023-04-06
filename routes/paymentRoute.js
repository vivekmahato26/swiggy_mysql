const { Router } = require("express");
const { checkoutSession, paymentIntent } = require("../controllers/paymentController");

const paymentRouter = new Router();

paymentRouter.get("/checkout", async(req,res) => {
    try {
        const data = await checkoutSession();
        res.send(data);
    } catch (error) {
        res.send(error.message)
    }
})

paymentRouter.post("/paymentIntent", async(req,res) => {
    try {
        console.log(123);
        const data = await paymentIntent(req);
        res.send(data);
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = paymentRouter;
