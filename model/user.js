const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let answer = new Schema(
  {
    name: {
      type: String,
      default: "no name",
    },

    email: {
      type: String,
      default: "no email",
    },
    password: {
      type: String,
      default: null,
    },
    auth_key: {
      type: String,
      default: null,
    },
    brokrage: {
      type: String,
      default: null,
    },

    mobile: {
      type: Number,
      default: null,
    },
    access:{
      type:Boolean,
      default:true
    },
    otp:{
      type:Number,
      default:null
    }
  },
  {
    timestamps: true,
    versionKey: "",
  }
);
module.exports = mongoose.model("user", answer);
