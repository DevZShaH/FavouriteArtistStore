const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    //Creates new schema i.e table into the database
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", UserSchema); //we first have to pass all the key-value of user here

module.exports = User;