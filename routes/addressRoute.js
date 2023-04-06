const { Router } = require("express");
const {
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses,
} = require("../controllers/addressController");

const addressRouter = new Router();

addressRouter.post("/addAddress", async (req, res) => {
  try {
    const data = addAddress(req);
    return data;
  } catch (error) {
    res.send(error.message);
  }
});
addressRouter.patch("/:addressId", async (req, res) => {
  try {
    const data = updateAddress(req);
    return data;
  } catch (error) {
    res.send(error.message);
  }
});
addressRouter.delete("/:addressId", async (req, res) => {
  try {
    const data = deleteAddress(req);
    return data;
  } catch (error) {
    res.send(error.message);
  }
});

addressRouter.get("/addresses", async (req, res) => {
  try {
    const data = getAddresses(req);
    return data;
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = addressRouter;
