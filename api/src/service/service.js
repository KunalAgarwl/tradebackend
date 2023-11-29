let adminModel = require("../../../model/admin");
let serviceModel = require("../../../model/service");
let transactionModel = require("../../../model/transaction");
let userModel = require("../../../model/user");
let randomstring = require("randomstring");
const twilio = require("twilio");
const xlsx = require("xlsx");

// Your Twilio Account SID and Auth Token
const accountSid = "ACyour_account_sid";
const authToken = "your_auth_token";

const client = twilio(accountSid, authToken);

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { mailsend } = require("../../../utillsfunction/nodemailer");

let mongoose = require("mongoose");
const user = require("../../../model/user");
const stockexchange = require("../../../model/stockexchange");

//USER

exports.register_user_save = async (req) => {
  try {
    let salt = bcrypt.genSaltSync(10);
    req.body.pass = bcrypt.hashSync(req.body.pass, salt);
    let name = req.body.name;
    let email = req.body.email;
    let pass = req.body.pass;
    let number = req.body.mobile;
    const otp = randomstring.generate({
      length: 6,
      charset: "numeric",
    });
    let data = userModel.findOne({ email: email });
    if (data.email) {
      return {
        message: "already exixt",
        data: [],
        sucess: false,
      };
    } else {
      const mailOptions = {
        To: email,
        Subject: "Your OTP Code",
        Text: `Your OTP code is: ${otp}`,
      };
      mailsend(mailOptions);

      let savedata = new userModel({
        name: name,
        email: email,
        password: pass,
        mobile: number,
        otp: otp,
      });
      let saved_data = await savedata.save();
      if (saved_data) {
        return {
          message: "data saved",
          data: saved_data,
          sucess: true,
        };
      } else {
        return {
          message: "data not saved",
          data: [],
          sucess: false,
        };
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};
exports.login_user = async (req) => {
  let email = req.body.email;
  let data = await userModel.findOne({ email: email });
  console.log(data);

  if (data) {
    let matchpass = bcrypt.compareSync(req.body.pass, data.password);

    if (matchpass) {
      const token = jwt.sign(
        { _id: data._id.toString() },
        process.env.SECRET_KEY
      );
      console.log("Generated token:", token);

      await userModel.findByIdAndUpdate({ _id: data._id }, { auth_key: token });

      return {
        message: "User is logged in",
        success: true,
        token: token,
        status: 200,
      };
    } else {
      return {
        message: "Invalid credentials",
        success: false,
        status: 400,
      };
    }
  } else {
    return {
      message: "Invalid credentials",
      success: false,
      status: 380,
    };
  }
};

exports.signout = async (req) => {
  try {
    if (req.body.token) {
      const token = req.body.token;
      let data = await userModel.findOneAndUpdate(
        { auth_key: token },
        { auth_key: null },
        { new: true }
      );

      console.log("hellokunala", data);
      if (data.auth_key == null) {
        return {
          data: data,
          message: "user is logout",
          sucess: true,
          status: 200,
        };
      } else {
        return {
          data: data,
          message: "user is not logout",
          sucess: false,
          status: 300,
        };
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.mcx = async (req) => {
  try {
    let type = req.body.type;
    let userid = req.body.userid;
    let stockname = req.body.stockname;
    let stockprice = req.body.stockprice;
    let lotprice = req.body.lotprice;
    let lot = req.body.lot;

    let stockdata = new stockexchange({
      type: type,
      userid: userid,
      stockname: stockname,
      price: price,
      lotprice: lotprice,
      stockprice: stockprice,
      lot: lot,
    });
    await stockdata.save();
    return {
      message: "Stock saved successfully",
      data: stockdata,
      sucess: true,
    };
  } catch (error) {
    console.log("error", error);
  }
};
