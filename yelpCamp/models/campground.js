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


module.exports= mongoose.model('campGround', campGroundSchema);