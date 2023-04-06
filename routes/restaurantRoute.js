const { Router } = require("express");
const multer = require("multer");
const { addRestaurants, getRestaurants, updateRestraunts } = require("../controllers/restaurantsController");
const upload = new multer({ dest: "/uploads" });

const restaurantRouter = new Router();

restaurantRouter.post("/addRestaurant", upload.single(),async(req,res) => {
    try {
        const data = await addRestaurants(req);
        return data;
    } catch (error) {
        res.send(error.message)
    }
})
restaurantRouter.get("/", async(req,res) => {
    try {
        const data = await getRestaurants(req);
        return data;
    } catch (error) {
        res.send(error.message)
    }
})
restaurantRouter.patch("/:restaurantId",async(req,res) => {
    try {
        const data = await updateRestraunts(req);
        return data;
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = restaurantRouter;