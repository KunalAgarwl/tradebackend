let {
  register_user_save,
  login_user,
  mcx,
  signout,
} = require("./../service/service");

//USER

exports.register_user_save = async (req, res) => {
  let data = await register_user_save(req);
  console.log(req.body.email);
  if (data.sucess) {
    res.render("otpsend", { data: data.data });
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};

exports.login_user = async (req, res) => {
  let data = await login_user(req);
  console.log(data);
  if (data.success) {
    res.send({ message: "login successfully", status: 200, data: data });
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};
exports.signout = async (req, res) => {
  console.log(req);
  let data = await signout(req);
  if (data.sucess) {
    console.log(data);
    res.send({ message: "logout successfully", status: 200, data: data });
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};

exports.mcx = async (req, res) => {
  let data = await mcx(req);
  if (data.sucess) {
    res.render("otpsend", { data: data.data });
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};
