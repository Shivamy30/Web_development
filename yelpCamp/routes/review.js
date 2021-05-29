
const express= require('express');
const router= express.Router({mergeParams : true});
const catchAsync= require('../utils/catchAsync');
const ExpressError= require('../utils/expressError');
const campGround= require('../models/campground');
const Review= require('../models/review');

const {campgroundSchema,reviewSchema}= require('../schemas')

const validateReview= (req,res,next)=>{
    const {error}= reviewSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}

router.post('/',validateReview,catchAsync(async(req,res)=>{
    const campground= await campGround.findById(req.params.id);
    const review= new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
       
}));

router.delete('/:revId',catchAsync( async(req,res,next)=>{
     const {id, revId}= req.params;
     await campGround.findByIdAndUpdate(id, {$pull: {reviews: revId}});
     await Review.findByIdAndDelete(revId);
     res.redirect(`/campgrounds/${id}`);
}));


module.exports= router
