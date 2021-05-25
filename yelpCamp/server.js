const express= require('express');
const mongoose= require('mongoose');
const path= require('path');
const ejsMate= require('ejs-mate');
const catchAsync= require('./utils/catchAsync');
const ExpressError= require('./utils/expressError');
const methodOverride= require('method-override');
// const campground = require('./models/campground');
const Review= require('./models/review');
const joi = require('joi');
const {campgroundSchema, reviewSchema}= require('./schemas')
const app= express();


const campGround= require('./models/campground');
const Joi = require('joi');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log('connection open')
}) .catch((err)=>{
    console.log(err);
})

const validateCamp=(req,res,next)=>{
    console.log(campgroundSchema)
    const {error}= campgroundSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}
const validateReview= (req,res,next)=>{
    const {error}= reviewSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}
app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/campgrounds', async (req,res)=>{
    const campGrounds= await campGround.find({});
    res.render('campgrounds/index',{campGrounds})
});


app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
});

app.post('/campgrounds',validateCamp, catchAsync(async(req,res)=>{

   
    const newCamp= await new campGround(req.body.campground);
    await newCamp.save();
     res.redirect(`/campgrounds/${newCamp._id}`);

}));

app.get('/campgrounds/:id', catchAsync(async (req,res)=>{
    const {id}= req.params;
    const camp= await campGround.findOne({_id:id});
     res.render('campgrounds/show',{camp});
}));

app.get('/campgrounds/:id/edit', catchAsync(async(req,res)=>{
    const {id}= req.params;
    const camp= await campGround.findOne({_id:id});
    res.render('campgrounds/edit',{camp});
}));

app.put('/campgrounds/:id', validateCamp, catchAsync(async (req,res)=>{
    const {id}= req.params;
    const camp= await campGround.findByIdAndUpdate(id,req.body.campground);
    res.redirect(`/campgrounds/${camp._id}`);

}));

app.delete('/campgrounds/:id', catchAsync(async (req,res)=>{
    const {id}= req.params;
    await campGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async(req,res)=>{
    const campground= await campGround.findById(req.params.id);
    const review= new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
       
}));

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})
app.use((err,req,res,next)=>{
    console.log(err.message)
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