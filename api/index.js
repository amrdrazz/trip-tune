require("dotenv").config();
const path = require("path")
const express = require("express");
const app = express();

const cors = require('cors')

app.use(cors({
    origin:"http://localhost:5173"
}))

const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.static("public"));

const Place = require("../models/place");
const User = require("../models/user");

const sendEmail = require('../sendEmail');

const connectDB = require('../connectDB');

async function start(){

    try{
        await connectDB();

        console.log("Connected successfuly");

    }catch(error){

        console.log(
            "error with connecting database/ "
            + error
            + " url="
            + process.env.database
        );
    }

}

start();





//  Endpoints =========


app.get("/", (req, res)=>{
    try{
        res.sendFile(path.join(__dirname, "../views", "docs.html"))
    }catch(error){
        console.log(error)
    }
})


app.get("/getplaces", async (req, res)=>{
    try{
        const places = await Place.find();
        res.send(places)
    }catch(error){
        console.log(error)
    }
});

app.get("/getplaces/:personality", async (req, res)=>{
    try{
        const places = await Place.find({
            vibe: req.params.personality
        });
        res.send(places)
    }catch(error){
        console.log(error)
    }
});

app.get("/getplaces/:personality/:city", async (req, res)=>{
    try{
        let places = []
        if (req.params.personality === 'any'){
            places = await Place.find({
                government: req.params.city
            });
        }else{
            places = await Place.find({
                vibe: req.params.personality,
                government: req.params.city
            });
        }
        res.send(places)
    }catch(error){
        console.log(error)
    }
});





app.post('/addUser',async (req, res)=>{
    try{
        const code = Math.floor(1000 + Math.random() * 9000)
        const {email, username, password, personality} = req.body;

        if(!email || !username || !password){
            return res.status(400).json({ message:"All fields required" })
        }

        const existingUsername = await User.findOne(
            {username}
        )

        const existingEmail = await User.findOne(
            {email}
        )

        if(existingUsername){
            return res.status(409).json({
                message: "Username already exists"
            })
        }

        if(existingEmail){
            return res.status(409).json({
                message: "Email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            personality,
            verificationCode: code,
            verified: false
        })

        await sendEmail(email, code)

        await newUser.save()

        return res.status(200).json({
            message:"Code sent successfully"
        })

    }catch(error){
        console.log(error)

        res.status(500).json({
            message:"Server Error"
        })
    }



})


app.post('/verifyCode',async (req, res) => {
    try{
        const {email, code} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }

        if(user.verificationCode !== code){
            return res.status(400).json({
                message:"Invalid code"
            })
        }

        user.verified = true
        user.verificationCode = null

        await user.save()

        return res.status(200).json({
            message:"Account verified"
        })

    }catch(error){
        console.log(error)
        
        return res.status(500).json({
            message:"Server Error"
        })
    }
})


app.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"All fields required"
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }

        if(!user.verified){
            return res.status(403).json({
                message:"Verify email first"
            })
        }

        const matched = await bcrypt.compare(
            password,
            user.password
        )

        if(!matched){
            return res.status(401).json({
                message:"Wrong password"
            })
        }

        return res.status(200).json({
            message:"Login successful"
        })


    }catch(error){
        console.log(error)

        return res.status(500).json({
            message:"Server Error"
        })
    }
})


app.get('/cleanup-users', async(req,res)=>{

    if(req.headers['x-vercel-cron'] !== '1'){
        return res.sendStatus(401)
    }

    try{

        const deletedUsers = await User.deleteMany({
            verified:false,
            createdAt:{
                $lt:new Date(
                    Date.now() - 5*60*1000
                )
            }
        })

        return res.status(200).json({
            deleted: deletedUsers.deletedCount
        })

    }catch(error){

        return res.status(500).json({
            message:error.message
        })
    }
})


// =============
module.exports = app