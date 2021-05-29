const express= require('express');
const app= express();

const cookieParser= require('cookie-parser');

app.use(cookieParser());

app.get('/greet',(req,res)=>{
    const {name='shivem'}=req.cookies;
    res.send(`hello greeting for the day ${name}`);
})

app.get('/setname',(req,res)=>{
    res.cookie('name','henrietta')
    res.cookie('animal','harlequin shrimp')
    res.send('ok sent you a cookies')
})
app.listen('3333',()=>{
    console.log('server started on 3333')
})