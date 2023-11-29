const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/apiauth");
const multer = require("multer");
const upload = multer({ dest: "../../public/images/" });
let {
  register_user_save,
  login_user,
  mcx,
  signout,
} = require("./../controller/controller");
//USER
router.post("/register_user_save", register_user_save);
router.post("/login_user", login_user);
router.post("/signout", signout);

router.post("/mcx", mcx);
// router.post("/sellmcx", sellmcx);

module.exports = router;
