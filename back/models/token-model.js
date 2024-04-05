const {Schema,model}=require('mongoose');

const TokenSchema = new Schema({
    user:{type:Schema.Types.ObjectId, ref:"User"},//ssilka na polbzovatelya
    refreshToken:{type:String, require:true}//refreshToken
})

module.exports = model("Token",TokenSchema);