const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    personality: String,
    verificationCode: Number,
    verified: Boolean,
    createdAt: Date
});




const User = mongoose.model("User", userSchema);

module.exports = User;