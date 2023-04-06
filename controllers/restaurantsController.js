const path = require("path");
const { readFile, rm } = require("fs");
const { executeQuery } = require("../mysql");

const baseDir = __dirname.split("\\");
baseDir.pop();

const baseDirStr = baseDir.join("\\");

const uploadsDir = path.join(baseDirStr + "/uploads");

const readFilePromise = (fileLocation) =>
  new Promise((resolve, reject) => {
    readFile(fileLocation, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });

module.exports.addRestaurants = async ({ isAuth, body, file }) => {
  try {
    if (!isAuth) {
      throw new Error("Please Login!!!");
    }
    const { name, rating, location } = body;
    const fileLocation = path.join(uploadsDir, file.filename);
    const fileData = await readFilePromise(fileLocation);
    const addResQuery = `INSERT INTO restaurants (name,rating,location,img) VALUES ("${name}",${rating},"${location}",${fileData})`;
    const data = await executeQuery(addResQuery);
    await rm(uploadsDir, { recursive: true });
    return data;
  } catch (error) {
    return error;
  }
};


module.exports.getRestaurants = async () => {
    try {
        const getResQuery = "SELECT * FROM restraunts";
        const data = await executeQuery(getResQuery);
        return data;
    } catch (error) {
        return error;
    }
}

module.exports.updateRestraunts = async({body,params,isAuth}) => {
    try {
        if(!isAuth) {
            throw new Error("Please Login !!!")
        }
        let updateResQuery = "UPDATE restaurants SET ";
        const {restaurantId} = params;
        for(let key in body) {
            if(typeof body[key] == "number") {
                updateResQuery += `${key}=${body[key]}`
            }
            updateResQuery += `${key}="${body[key]}"` 
        }
        updateResQuery += ` updateAt=${new Date()} WHERE id=${restaurantId}`;
        const data = await executeQuery(updateResQuery);
        return data;
    } catch (error) {
        return error;
    }
}