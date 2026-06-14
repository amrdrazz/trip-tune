const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: String,
    about: String,
    images: {
        headImg: String,         //the main image
        allImages: Array      //the swiper images
    },
    video: String,
    openingHours: String,    
    location: String,
    government: String,
    price: String,
    vibe: [String],            //[creative,social,organized,analytical]
    ticket: String,
    tags: [String],
    rating: {
        rate: Number,
        usersRated: Number
    }
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;