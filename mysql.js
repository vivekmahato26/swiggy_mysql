const mysql = require("mysql");

const mysqlConn = mysql.createPool({
  connectionLimit: 10,
  database: process.env.MYSQL_DB,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
});

const executeQuery = (query) => {
  return new Promise((resolve, reject) => {
    mysqlConn.query(query, (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

module.exports = { mysqlConn, executeQuery };
