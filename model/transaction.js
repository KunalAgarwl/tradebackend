const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectId;
let answer = new Schema(
  {
    userid: {
      type: String,
      default: "no name",
    },
    amount: {
      type: Number,
      default: "no email",
    },
    status: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: "",
  }
);
module.exports = mongoose.model("transaction", answer);
