const express= require('express');
const app= express();



app.get('/greet',(req,res)=>{
    res.send('hello greeting for the day ');
})

app.get('/setname',(req,res)=>{
    res.cookie('name','henrietta')
    res.cookie('animal','harlequin shrimp')
    res.send('ok sent you a cookies')
})
app.listen('3333',()=>{
    console.log('server started on 3333')
})