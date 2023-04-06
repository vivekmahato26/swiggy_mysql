const { executeQuery } = require("../mysql");

module.exports.addAddress = async ({ body, isAuth, userId }) => {
  try {
    if (!isAuth) {
      throw new Error("Please Login!!!!!");
    }
    const { doorNo, locality, landmark, city, pin, phone, state, country } =
      body;
    let addAddressQuery;
    if (landmark) {
      addAddressQuery = `INSERT INTO address (doorNo,locality,landmark,city,pin,phone,state,country,userId) VALUES ("${doorNo}","${locality}","${landmark}","${city}",${pin},${phone},"${state}","${country}",${userId})`;
    } else {
      addAddressQuery = `INSERT INTO address (doorNo,locality,city,pin,phone,state,country,userId) VALUES ("${doorNo}","${locality}","${city}",${pin},${phone},"${state}","${country}",${userId})`;
    }
    const data = await executeQuery(addAddressQuery);
    const getLastEntryQuery =
      "SELECT * FROM address LIMIT 1 ORDER BY createdAt DESC";
    const addressData = await executeQuery(getLastEntryQuery);
    const addressId = addressData[0].id;
    const userQuery = "SELECT address FROM users WHERE id=" + userId;
    const userData = await executeQuery(userQuery);
    const address = userData[0].address;
    const jsonData = JSON.parse(address);
    const updatedAddress = JSON.stringify(jsonData.push(addressId));
    const updateUserQuery =
      "UPDATE users SET address=" + updatedAddress + "WHERE id=" + userId;
    const updatedUserData = await executeQuery(updateUserQuery);
    return data;
  } catch (error) {
    return error;
  }
};

module.exports.deleteAddress = async ({ params, isAuth }) => {
  try {
    if (!isAuth) {
      throw new Error("Please Login !!!");
    }
    const { addressId } = params;
    const deleteAddressQuery = "DELETE FROM address WHERE id=" + addressId;
    const data = await executeQuery(deleteAddressQuery);
    return data;
  } catch (error) {
    return error;
  }
};

module.exports.updateAddress = async ({ body, isAuth, params }) => {
  try {
    if (!isAuth) {
      throw new Error("Please Login !!!");
    }
    const { addressId } = params;
    let updateAddressQuery = "UPDATE address SET ";
    for (const key in body) {
      if (typeof body[key] == "number") {
        updateAddressQuery += `${key}=${body[key]}`;
      }
      updateAddressQuery += `${key}="${body[key]}"`;
    }
    updateAddressQuery += `updatedAt=${new Date()} WHERE id=${addressId}`;
    const data = await executeQuery(updateAddressQuery);
    return data;
  } catch (error) {
    return error;
  }
};

module.exports.getAddresses = async({isAuth,userId}) => {
    try {
        if(!isAuth) {
            throw new Error("Please LOgin!!!");
        }
        const getAddressQuery = `SELECT * FROM address WHERE userId=${userId} LIMIT 5 ORDER BY createdAt DESC`;
        const data = await executeQuery(getAddressQuery);
        return data;
    } catch (error) {
        return error;
    }
}