const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const MenuSchema = new Schema(
    {
        name: { type: String, require: true },
        price: { type: Number, default: 0 }
    },
    { collection: "menu" } //ชื่อ collection ใน DB
);

var MenuModel = mongoose.model("review", MenuSchema); //ชื่อ model ใน code
module.exports = MenuModel;