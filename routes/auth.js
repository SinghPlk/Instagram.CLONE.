const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
//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


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"

    }
}))
router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body
    if(!email || !password || !name){
    return res.status(422).json({error:"Please fill in all the details"})

    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User Already Exists With The Email"})

        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic
            })
    
            user.save()
            .then(user=>{
                     transporter.sendMail({
                     to:user.email,
                     from:"no-reply@insta.com",
                     subject:"signup success",
                     html:"<h1>welcome to instagram</h1>"
                 })
                res.json({message:"Saved Successfully"})
            })
            .catch(err=>{
                console.log(err)
            })

        })


    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
      return  res.status(422).json({error:"Please Add Email or Password"})

    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"Successfully Signed In"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const{_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or Password"})

            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})


router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"no-replay@insta.com",
                    subject:"password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })

        })
    })
})

module.exports = router