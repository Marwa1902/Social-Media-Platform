const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require: true,
        min: 2,
        max: 25,
        unique:true
    },
    email:{
        type:String,
        require: true,
        max: 50,
        unique:true
    },
    password:{
        type:String,
        require: true,
        min: 8,
    },
    followers:{
        type: Array,
        default:[]
    },
    following:{
        type: Array,
        default:[]
    },
    profilePicture:{
        type: String,
        default:""
    },
    isAdmin:{
        type: Boolean,
        deafault: false
    },
    desc:{
        type: String
    }
},
 {timestamps:true}
);

module.exports = mongoose.model("User", UserSchema);