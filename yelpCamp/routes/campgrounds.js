
const express= require('express');
const router= express.Router();
const catchAsync= require('../utils/catchAsync');
const ExpressError= require('../utils/expressError');
const campGround= require('../models/campground');
const {campgroundSchema}= require('../schemas')



const validateCamp=(req,res,next)=>{
  //  console.log(campgroundSchema)
    const {error}= campgroundSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}
router.get('/', catchAsync(async(req,res)=>{
    const campGrounds= await campGround.find({});
    res.render('campgrounds/index',{campGrounds})
}));

router.get('/new',(req,res)=>{
    res.render('campgrounds/new');
});

router.post('/',validateCamp, catchAsync(async(req,res)=>{
    const newCamp= await new campGround(req.body.campground);
    await newCamp.save();
    req.flash('success', 'campground created successfully!!');
     res.redirect(`/campgrounds/${newCamp._id}`);

}));

router.get('/:id', catchAsync(async (req,res)=>{
    const {id}= req.params;
    const camp= await campGround.findOne({ _id: id }).populate('reviews');
    if(!camp){
        req.flash('error', 'Cannot find campground');
       return res.redirect('/campgrounds')
    }
     res.render('campgrounds/show',{camp});
}));

router.get('/:id/edit', catchAsync(async(req,res)=>{
    const {id}= req.params;
    const camp= await campGround.findOne({_id:id});
    res.render('campgrounds/edit',{camp});
}));

router.put('/:id', validateCamp, catchAsync(async (req,res)=>{
    const {id}= req.params;
    const camp= await campGround.findByIdAndUpdate(id,req.body.campground);
    res.redirect(`/campgrounds/${camp._id}`);

}));

router.delete('/:id', catchAsync(async (req,res)=>{
    const {id}= req.params;
    await campGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports= router;