let adminModel = require("../../../model/admin");
let serviceModel = require("../../../model/service");
let transactionModel = require("../../../model/transaction");
let userModel = require("../../../model/user");
let randomstring = require("randomstring");
let nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

let mongoose = require("mongoose");
const user = require("../../../model/user");

const transporter = nodemailer.createTransport({
  service: "gmail", // E.g., 'Gmail' or use your SMTP server settings
  auth: {
    user: "aceisop107@gmail.com",
    pass: "jrssmgnffnyszecj",
  },
});

exports.register_data_save = async (req) => {
  try {
    let salt = bcrypt.genSaltSync(10);
    req.body.pass = bcrypt.hashSync(req.body.pass, salt);
    let name = req.body.name;
    let email = req.body.email;
    let pass = req.body.pass;
    let number = req.body.mobile;
    console.log(name, email, pass, number);

    let savedata = new adminModel({
      name: name,
      email: email,
      password: req.body.pass,
      mobile: number,
    });
    let saved_data = await savedata.save();
    if (saved_data)
      return {
        message: "data saved",
        data: saved_data,
        sucess: true,
      };
    else {
      return {
        message: "data not saved",
        data: [],
        sucess: false,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.verify_otp = async (req, res) => {
  try {
    let email = req.body.email;
    let otp = req.body.otp;
    let data = await userModel.findOne({ email: email });
    if (data.otp == otp) {
      return {
        message: "data saved",
        data: data,
        sucess: true,
      };
    } else {
      await userModel.findByIdAndDelete({ _id: data._id });
      return {
        message: "data not saved",
        data: [],
        sucess: false,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

//login
exports.login_data_validation = async (req, res) => {
  try {
    let data = await adminModel.findOne({ email: req.body.email });
    if (data) {
      let matchpass = bcrypt.compareSync(req.body.pass, data.password);
      if (matchpass) {
        const token = jwt.sign(
          { _id: data._id.toString() },
          process.env.SECRET_KEY
        );
        await adminModel.findByIdAndUpdate(
          { _id: data._id },
          { auth_key: token }
        );
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 10000 * 60 * 60), //1 minit
          httpOnly: true,
          overwrite: true,
        });

        return {
          name: data.name,
          message: "user is logined",
          sucess: true,
          status: 200,
        };
      } else {
        return {
          message: "invalid credentials",
          sucess: false,
          status: 300,
        };
      }
    } else {
      return {
        message: "invalid credentials",
        sucess: false,
        status: 300,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

//add service
exports.add_admin_service = async (req) => {
  try {
    let name = req.body.name;
    let price = req.body.price;
    let duration = req.body.duration;
    let category = req.body.category;
    let adddata = new serviceModel({
      service_name: name,
      service_price: price,
      duration: duration,
      category: category,
    });
    let saved_data = await adddata.save();

    if (saved_data)
      return {
        message: "data saved",
        data: saved_data,
        sucess: true,
      };
    else {
      return {
        message: "data not saved",
        data: [],
        sucess: false,
      };
    }
  } catch (error) {
    console.log("error", error);
  }

  //saving database
};

//updating data

exports.update_service = async (req) => {
  try {
    let condition = {};
    if (req.body.name) {
      condition.name = req.body.name;
    }
    if (req.body.email) {
      condition.email = req.body.email;
    }
    if (req.body.brokrage) {
      condition.brokrage = req.body.brokrage;
    }
    if (req.body.passowrd) {
      let salt = bcrypt.genSaltSync(10);
      condition.passowrd = bcrypt.hashSync(req.body.passowrd, salt);
    }
    let id = req.query.id;
    console.log("condition", condition, "id", id);
    let updatedata = await userModel.findByIdAndUpdate({ _id: id }, condition);
    if (updatedata) {
      return {
        message: "data saved",
        data: updatedata,
        sucess: true,
      };
    } else {
      return {
        message: "data not saved",
        data: [],
        sucess: false,
      };
    }
  } catch (error) {
    console.log("error", error);
  }

  //saving database
};

//viewservice
exports.resservice = async (req, res) => {
  try {
    let data = await serviceModel.find();
    if (data) {
      if (req.user) {
        return {
          name: req.user.name,
          data: data,
          message: "user is logined",
          sucess: true,
          status: 200,
        };
      }
    } else {
      return {
        data: data,
        message: "invalid credentials",
        sucess: false,
        status: 300,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

//filter services

exports.filter_service = async (req, res) => {
  try {
    let condition = {};
    if (req.body.filtername) {
      condition.service_name = req.body.filtername;
    }
    if (req.body.filterprice) {
      condition.service_price = req.body.filterprice;
    }
    if (req.body.filtercategory) {
      condition.category = req.body.filtercategory;
    }
    if (req.body.filterduration) {
      condition.duration = req.body.filterduration;
    }
    console.log(condition);
    let data = await serviceModel.find(condition);

    if (data) {
      if (req.user && data) {
        return {
          name: req.user.name,
          data: data,
          message: "user is logined",
          sucess: true,
          status: 200,
        };
      }
    } else {
      return {
        data: data,
        message: "invalid credentials",
        sucess: false,
        status: 300,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

//signout
exports.signout = async (req, res) => {
  try {
    if (req.cookies.jwt != undefined && req.cookies.jwt != "") {
      const token = req.cookies.jwt;
      let data = await adminModel.findOneAndUpdate(
        { auth_key: token },
        { auth_key: null }
      );
      res.cookie("jwt", "");
      if (data) {
        return {
          data: data,
          message: "user is logined",
          sucess: true,
          status: 200,
        };
      } else {
        return {
          data: data,
          message: "invalid credentials",
          sucess: false,
          status: 300,
        };
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

//adminProfile
exports.adminprofile = async (req, res) => {
  try {
    if (req.user) {
      let data = await adminModel.findOne({ _id: req.user._id });

      if (data) {
        return {
          data: data,
          message: "user is logined",
          sucess: true,
          status: 200,
        };
      } else {
        return {
          message: "invalid credentials",
          sucess: false,
          status: 300,
        };
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

//Updating admin data
exports.update_profile = async (req, res) => {
  try {
    if (req.user) {
      let condition = {};
      if (req.body.name) {
        condition["name"] = req.body.name;
      }
      if (req.body.mobile) {
        condition["mobile"] = req.body.mobile;
      }

      if (req.file) {
        condition[
          "image"
        ] = `${process.env.ADMIN_IMAGE_FOLDER}${req.file.filename}`;
      }
      let updatedata = await adminModel.findOneAndUpdate(
        { auth_key: req.user.auth_key },
        condition,
        { new: true }
      );
      if (updatedata)
        return {
          message: "data saved",

          data: updatedata,
          sucess: true,
        };
      else {
        return {
          message: "data not saved",
          data: null,
          sucess: false,
        };
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};
exports.change_pass = async (req, res) => {
  try {
    let id = req.body.id;
    let oldpass = req.body.oldpass;
    let salt = bcrypt.genSaltSync(10);
    req.body.pass = bcrypt.hashSync(req.body.pass, salt);
    let pass = req.body.pass;
    console.log(id, oldpass, pass);
    let data = await adminModel.findOne({ _id: id });
    if (data) {
      let matchpass = bcrypt.compareSync(oldpass, data.password);

      if (matchpass) {
        let updatedata = await adminModel.findByIdAndUpdate(
          {
            _id: id,
          },
          {
            password: pass,
          }
        );
        if (updatedata) {
          return {
            message: "data saved",
            sucess: true,
          };
        } else {
          return {
            message: "data not saved",
            data: null,
            sucess: false,
          };
        }
      } else {
        return {
          message: "password not match",
          data: null,
          sucess: false,
        };
      }
    } else {
      return {
        message: "data not saved",
        data: null,
        sucess: false,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.transaction_view = async (req, res) => {
  try {
    let data = await transactionModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $unwind: {
          path: "$result",
        },
      },
      {
        $addFields: {
          email: "$result.email",
        },
      },
    ]);
    if (data) {
      if (req.user) {
        return {
          name: req.user.name,
          data: data,
          message: "user is logined",
          sucess: true,
          status: 200,
        };
      }
    } else {
      return {
        data: data,
        message: "invalid credentials",
        sucess: false,
        status: 300,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.filter_transaction = async (req, res) => {
  try {
    let condition = [];
    if (req.body.filteramount) {
      condition.push({
        $match: {
          amount: {
            $gte: Number(req.body.filteramount),
          },
        },
      });
    }
    if (req.body.filteremail) {
      condition.push({
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                email: req.body.filteremail,
              },
            },
          ],
          as: "result",
        },
      });
    } else {
      condition.push({
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          as: "result",
        },
      });
    }
    condition.push({
      $unwind: {
        path: "$result",
      },
    });
    condition.push({
      $addFields: {
        email: "$result.email",
      },
    });

    let data = await transactionModel.aggregate(condition);

    if (data) {
      if (req.user && data) {
        return {
          name: req.user.name,
          data: data,
          message: "user is logined",
          sucess: true,
          status: 200,
        };
      }
    } else {
      return {
        data: data,
        message: "invalid credentials",
        sucess: false,
        status: 300,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.user_view = async (req, res) => {
  try {
    let data = await userModel.find();
    if (data) {
      if (req.user) {
        return {
          name: req.user.name,
          data: data,
          message: "user is logined",
          sucess: true,
          status: 200,
        };
      }
    } else {
      return {
        data: data,
        message: "invalid credentials",
        sucess: false,
        status: 300,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

//user filter

exports.filter_user = async (req, res) => {
  try {
    let condition = {};
    if (req.body.filtername) {
      condition.name = req.body.filtername;
    }
    if (req.body.filteremail) {
      condition.email = req.body.filteremail;
    }
    if (req.body.filtermobile) {
      condition.mobile = req.body.filtermobile;
    }
    let data = await userModel.find(condition);

    if (data) {
      if (req.user && data) {
        return {
          name: req.user.name,
          data: data,
          message: "user is logined",
          sucess: true,
          status: 200,
        };
      }
    } else {
      return {
        data: data,
        message: "invalid credentials",
        sucess: false,
        status: 300,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

//send mail

exports.mailsend = async (req, res) => {
  try {
    email = req.body.to;
    sub = req.body.subject;
    mess = req.body.message;
    const mailOptions = {
      from: "aceisop107@gmail.com",
      to: email,
      subject: sub,
      text: mess,
    };
    // Send the email
    let data = await transporter.sendMail(mailOptions);

    if (data) {
      return {
        message: "invalid credentials",
        sucess: true,
        status: 300,
      };
    } else {
      return {
        message: "sent",
        sucess: false,
        status: 200,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

//block

exports.block = async (req, res) => {
  try {
    let id = req.body.id;
    let updatedata;

    if (req.body.access == "true") {
      updatedata = await userModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          access: false,
        }
      );
    } else {
      updatedata = await userModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          access: true,
        }
      );
    }
    if (updatedata) {
      return {
        message: "data saved",
        sucess: true,
      };
    } else {
      return {
        message: "not done",
        data: null,
        sucess: false,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

//USER

exports.register_user_save = async (req) => {
  try {
    let salt = bcrypt.genSaltSync(10);
    req.body.pass = bcrypt.hashSync(req.body.pass, salt);
    let name = req.body.name;
    let email = req.body.email;
    let pass = req.body.pass;
    let number = req.body.mobile;
    let Brokrage = req.body.brokrage;
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
      let savedata = new userModel({
        name: name,
        email: email,
        password: pass,
        mobile: number,
        brokrage: Brokrage,
      });
      let saved_data = await savedata.save();
      if (saved_data)
        return {
          message: "data saved",
          data: saved_data,
          sucess: true,
        };
      else {
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
