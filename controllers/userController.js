const { genSalt, hash, compare } = require("bcrypt");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const { executeQuery } = require("../mysql");
const { createTransport } = require("nodemailer");

module.exports.register = async ({ body }) => {
  try {
    const checkEmailQuery = `SELECT * FROM users WHERE email="${body.email}"`;
    const checkEmail = await executeQuery(checkEmailQuery);
    if (checkEmail.length) {
      throw new Error("Email already registered");
    }
    const salt = await genSalt();
    const hashedPass = await hash(body.password, salt);
    const registerQuery = `INSERT INTO users (name,email,phone,password) VALUES("${body.name}","${body.email}",${body.phone},"${hashedPass}")`;
    const newUser = await executeQuery(registerQuery);
    return newUser;
  } catch (error) {
    return error;
  }
};

module.exports.login = async ({ body }) => {
  try {
    const { email, password } = body;
    const checkEmailQuery = `SELECT * FROM users WHERE email="${email}"`;
    const checkEmail = await executeQuery(checkEmailQuery);
    if (!checkEmail.length) {
      throw new Error("Email not registered");
    }
    const { password: userPass, id } = checkEmail[0];
    const checkPass = await compare(password, userPass);
    if (!checkPass) {
      throw new Error("Wrong password");
    }
    const userData = { id, email };
    const token = CryptoJs.AES.encrypt(
      JSON.stringify(userData),
      process.env.TOKEN_SECRET
    ).toString();
    // const token = jwt.sign(userData,process.env.TOKEN_SECRET,{expiresIn:"1 day"});
    return { id, email, token };
  } catch (error) {
    return error;
  }
};

module.exports.generateLink = async ({ body }) => {
  try {
    const { email } = body;
    const checkEmailQuery = `SELECT * FROM users WHERE email="${email}"`;
    const checkEmail = await executeQuery(checkEmailQuery);
    if (!checkEmail.length) {
      throw new Error("Email not registered");
    }
    const userData = { id: checkEmail[0].id, email };
    const otp = Math.floor(Math.random() * 10000);
    const saveOtpQuery = `INSERT INTO otp (userId,email,otp) VALUES(${userData.id},"${email}",${otp})`;
    const saveOtp = await executeQuery(saveOtpQuery);
    // send Email OR SMS
    const transport = createTransport({
      service: "gmail",
      auth: {
        user: "vivekmahato26@gmail.com",
        pass: "8302459658",
      },
    });
    const token = CryptoJs.AES.encrypt(
      JSON.stringify(userData),
      process.env.TOKEN_SECRET
    ).toString();
    transport.sendMail(
      {
        to: email,
        from: "vivekmahato26@gmail.com",
        subject: "OTP for password Change",
        html: `
        <h1>OTP for changing password ${otp}</h1>
        <a href="http://localhost:4000/changePass?token=${token}">Change Password</a>
        `,
      },
      (err, info) => {
        if (err) throw new Error(err);
        console.log(info);
      }
    );
    return {
      ...userData,
      otp,
    };
  } catch (error) {
    return error;
  }
};

module.exports.changePass = async ({ body, query }) => {
  try {
    const { token } = query;
    const userData = CryptoJs.AES.decrypt(token).toString(CryptoJs.enc.Utf8);
    const fetchOtpQuery = `SELECT * FROM otp WHERE email="${userData.email}"`;
    const otpData = await executeQuery(fetchOtpQuery);
    const { otp: storedOtp, createdAt } = otpData[0];
    const currentDate = new Date();
    const generatedDate = new Date(createdAt);
    const timeElapsed = currentDate.getTime() - generatedDate.getTime();
    const totalDays = timeElapsed / (1000 * 60 * 60 * 24);
    if (totalDays > 1) {
      throw new Error("OTP expired");
    }
    const { otp, password } = body;
    if (otp != storedOtp) {
      throw new Error("Wrong OTP");
    }
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    const updateUserQuery = `UPDATE users SET (password) VALUES("${hashedPassword}") WHERE id=${userData.id}`;
    const updateUser = await executeQuery(updateUserQuery);
    return updateUser;
  } catch (error) {
    return error;
  }
};
