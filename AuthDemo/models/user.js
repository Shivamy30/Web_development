 const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
 const userSchema= new mongoose.Schema({

    username:{
        type: String,
        required: [true,'username can not be empty'],
    },
    password:{
        type: String,
        required: [true,'password can not be empty'],
    }
 });
userSchema.statics.findAndValidate= async function(username, password){
    const foundUser= await this.findOne({username});
    if(!foundUser) return false;
    const isValid= await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}
userSchema.pre('save', async function(next){
    if(this.isModified('password')) return next();
    this.password= await bcrypt.hash(this.password, 12);
    next();
})
 const User=  mongoose.model('User',userSchema);
 module.exports=User;