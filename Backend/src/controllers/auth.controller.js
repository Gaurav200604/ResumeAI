const userModel = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../model/blacklist.model');


/**
 * @name registerUserController
 * @description Register a new user
 * @access Public
 * 
 */

async function registerUserController(req,res){
   const {username,email,password} = req.body;

   if(!username || !email || !password){
    return res.status(400).json({message:"All fields are required"});
   }

   const isUserAlreadyExists = await userModel.findOne({
    $or:[
        {username:username},
        {email:email}
    ]
   })
   if(isUserAlreadyExists){

    return res.status(400).json({message:"User already exists"});
   }

   const hash = await bcrypt.hash(password,10);

   const user = await userModel.create({
    username:username,
    email:email,
    password:hash

   })

   const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn:"1d"});

   res.cookie("token",token);

   res.status(201).json({message:"User registered successfully",user:{
    id:user._id,
    username:user.username,
    email:user.email,
   }});




}


/**
 * @name loginUserController
 * @description Login a user
 * @access Public
 
*/

async function loginUserController(req,res){
    const {email,password} = req.body;

    const user = await userModel.findOne({email:email});

    if(!user){
        return res.status(400).json({message:"User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid credentials"});
    }

    const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn:"1d"});

    res.cookie("token",token);

    res.status(200).json({message:"Login successful",user:{
        id:user._id,
        username:user.username,
        email:user.email,
    }});
};

/**
 * @name logoutUserController
 * @description Logout a user
 * @access Public
 
*/

async function logoutUserController(req,res){
    const token = req.cookies.token;
    if(token){
      await BlacklistToken.create({token:token});
    }

    res.clearCookie("token");
    res.status(200).json({message:"Logout successful"});
};

/**
 * @name getMeController
 * @description Get the current logged-in user
 * @access Private
 */

async function getMeController(req,res){
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message:"User fetched successfully",

        user:{
        id:user._id,
        username:user.username,
        email:user.email,
    }});

}

module.exports = { registerUserController, loginUserController, logoutUserController ,getMeController };
