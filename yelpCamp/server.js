const express= require('express');
const mongoose= require('mongoose');
const path= require('path');
const ejsMate= require('ejs-mate');
const catchAsync= require('./utils/catchAsync');
const ExpressError= require('./utils/expressError');
const methodOverride= require('method-override');
const Review= require('./models/review');
const joi = require('joi');
const {campgroundSchema, reviewSchema}= require('./schemas')
const app= express();


const campGround= require('./models/campground');
const Joi = require('joi');
const campgroundsRoutes= require('./routes/campgrounds')
const reviewRoutes= require('./routes/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log('connection open')
}) .catch((err)=>{
    console.log('connection error');
})


app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

app.get('/',(req,res)=>{
    res.render('home');
});
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})
app.use((err,req,res,next)=>{
   console.log(err);
    if(!err.message){
        err.message= "something went wrong";
    } 
    if(!err.statusCode){
        err.statusCode=500;
    }
     res.status(err.statusCode).render('error',{err});
});
app.listen('3000', ()=>{
    console.log('sever stated on 3000');
});