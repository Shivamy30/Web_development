const mongoose= require('mongoose');
const Schema= mongoose.connection;


const reviewSchema= new Schema({
    body: String,
    rating: Number,

})


module.exports= mongoose.model('Review', reviewSchema);