require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const Place = require("../models/place");

mongoose.connect(process.env.database)
.then(()=>{
    console.log("Connected successfuly");
})
.catch((error)=>{
    console.log("error with connecting database/ " + error + ' url='+process.env.database + ' test=' + Object.keys(process.env));
});





//  Endpoints =========


app.get("/getplaces", async (req, res)=>{
    const places = await Place.find();
    res.send(places)
});

app.get("/getplaces/:class", async (req, res)=>{
    const places = await Place.find({
        vibe: req.params.class
    });
    res.send(places)
});

app.get("/getplaces/:class/:city", async (req, res)=>{
    let places = []
    if (req.params.class === 'any'){
        places = await Place.find({
            government: req.params.city
        });
    }else{
        places = await Place.find({
            vibe: req.params.class,
            government: req.params.city
        });
    }
    res.send(places)
});


// =============
module.exports = app