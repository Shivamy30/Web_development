const mongoose= require('mongoose');

const Schema= mongoose.Schema;
 const Review= require('./review');

const campGroundSchema= new Schema({
    title: String,
    image: String,
    price: Number,
    discription: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ]
});

campGroundSchema.post('findOneAndDelete', async function (campground){

    if(campground.reviews.length){
        const res= await Review.deleteMany({_id: {$in: campground.reviews}});
        console.log(res);
    }
})
module.exports= mongoose.model('campGround', campGroundSchema);