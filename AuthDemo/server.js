const express= require('express');
const app= express();
const User= require('./models/user');
const Path= require('path');
const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
const session= require('express-session')

mongoose.connect('mongodb://localhost:27017/authDemo',
 { useNewUrlParser: true,
   useUnifiedTopology: true })
     .then(()=>{
         console.log('mongo connection open')
     })
     .catch(err=>{
         console.log('ohh no error')
         console.log(err)
     })


app.set('view engine', 'ejs');
app.set('views', Path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}));
app.use(session({secret:'thisismysecret',resave:true,saveUninitialized:true}))

const requireLogin= (req,res,next)=>{
    if(!req.session.user_id) return res.redirect('/login')
    else next()
}
app.get('/register',(req,res)=>{
    res.render('register')
});

app.get('/', (req,res)=>{
    res.send('heyy this is your home page');
})

app.post('/register', async(req,res)=>{
    const {username ,password,confPass}= req.body;
    if(password!==confPass) res.redirect('/register'); 
    const user= new User({ username, password});
    await user.save();
    req.session.user_id= user._id;
    res.redirect('/secret')
})

app.get('/login',(req,res)=>{
    res.render('login')
});

app.post('/login', async(req,res)=>{
    const {username, password}= req.body;
    const user= await User.findAndValidate(username, password);
    if(user){
        req.session.user_id= user._id;
        res.redirect('/secret');
    } else{
        res.redirect('/login');
    }
});

app.post('/logout',(req,res)=>{
    req.session.user_id= null;
    res.redirect('/login')
})
app.get('/secret',requireLogin, (req,res)=>{
     res.render('secret')

})

app.listen(3000,()=>{
    console.log('server started on 3000')
})