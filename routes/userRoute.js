const { Router } = require("express");
const { register, login, generateLink, changePass } = require("../controllers/userController");

const userRouter = new Router();

userRouter.post("/register", async (req,res)=> {
    try {
        const data = await register(req);
        res.send(data);
    } catch (error) {
        res.send(error.message)
    }
});

userRouter.post("/login", async(req,res) => {
    try {
        const data = await login(req);
        res.send(data);
    } catch (error) {
        res.send(error.message)
    }
})

userRouter.post("/generateToken", async(req,res) => {
    try {
        const data = await generateLink(req);
        res.send(data);
    } catch (error) {
        res.send(error.message)
    }
})

userRouter.post("resetPassword", async(req,res) => {
    try {
        const data = await changePass(req);
        res.send(data);
    } catch (error) {
        res.send(error.message)
    }
})
module.exports = userRouter;