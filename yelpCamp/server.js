const express= require('express');
const mongoose= require('mongoose');
const path= require('path');
const methodOverride= require('method-override');
const campground = require('./models/campground');
const app= express();


const campGround= require('./models/campground');
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

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/campgrounds', async (req,res)=>{
    const campGrounds= await campGround.find({});
    res.render('campgrounds/index',{campGrounds})
});


app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
});

app.post('/campgrounds', async(req,res)=>{
    const newCamp= await new campGround(req.body.campground);
    await newCamp.save();
     res.redirect(`/campgrounds/${newCamp._id}`);

});
app.get('/campgrounds/:id', async (req,res)=>{
    const {id}= req.params;
    const camp= await campGround.findOne({_id:id});
     res.render('campgrounds/show',{camp});
});

app.get('/campgrounds/:id/edit', async(req,res)=>{
    const {id}= req.params;
    const camp= await campGround.findOne({_id:id});
    res.render('campgrounds/edit',{camp});
});

app.put('/campgrounds/:id', async (req,res)=>{
    const {id}= req.params;
    const camp= await campGround.findByIdAndUpdate(id,req.body.campground);
    res.redirect(`/campgrounds/${camp._id}`);

})

app.delete('/campgrounds/:id',async (req,res)=>{
    const {id}= req.params;
    await campGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})
app.listen('3000', ()=>{
    console.log('sever stated on 3000');
});