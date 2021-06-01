 const mongoose= require('mongoose');

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

 const User=  mongoose.model('User',userSchema);
 module.exports=User;