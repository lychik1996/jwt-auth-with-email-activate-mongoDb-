const {Schema,model}=require('mongoose');

const UserSchema = new Schema({
    email:{type:String, unique:true,require:true},
    password:{type:String,require:true},
    isActivated:{type:Boolean, default:false},//pole podtverzdeniya po4ti
    activationLink:{type:String},//silka dlya activatcii
})

module.exports = model("User",UserSchema);