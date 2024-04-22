const mongoose =require("mongoose");

const RefreshTokenSchema= mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiryDate:{
        type:Date,
        required:true
    }
});

RefreshTokenSchema.index({expiryDate:1},{expireAfterSeconds:0})

const RefreshToken= mongoose.model("RefreshToken",RefreshTokenSchema);
module.exports=RefreshToken