const { Router } = require("express");
const { register } = require("../controllers/userController");

const userRouter = new Router();

userRouter.post("/register", async (req,res)=> {
    try {
        const data = await register(req);
        res.send(data);
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = userRouter;