const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true

    },
    password:{
        type:String,
        required:true

    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/instagrampics24/image/upload/v1624815812/how-to-remove-profile-picture-on-zoom-12_ws6a6a.png"

},
    
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]

})

mongoose.model("User",userSchema)