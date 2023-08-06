const User= require ("../models/user")
const ErrorHandler=require("../utils/errorHandler")
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const sendToken= require("../utils/jwtToken")
const sendEmail= require("../utils/sendEmail")
const crypto = require("crypto");

//register a user => /api/v1/admin/register
exports.registerUser = catchAsyncErrors (async (req, res, next)=>{
    const { name, email, password, role}= req.body;
    const user= await User.create({
        name,
        email,
        password,
        role

    })

    sendToken (user, 200, res)
  
})

//login user => /api/v1/admin/login
exports.loginUser = catchAsyncErrors (async (req, res, next)=>{
    const { email, password}= req.body;
    //check if email and password is entered by user
    if (!email || !password) {
        return next (new ErrorHandler ("please enter email and password", 400))
    }

    //finding user in database
    const user =await User.findOne({email}).select("+password")

    if (!user){
        return next (new ErrorHandler ("Invalid email or password", 401))
    }

    //check if password is correct or not
    const isPasswordMatched =await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next (new ErrorHandler ("Invalid email or password", 401))
    }

   sendToken (user, 200, res)
})


        
//log out user => /api/v1/admin/logout
exports.logout =catchAsyncErrors (async (req, res, next)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message: "Logged out"
    })
})


//forgot passwor => /api/v1/pasword/forgot
exports.forgotPassword= catchAsyncErrors (async (req, res, next)=>{
    const user= await User.findOne({email: req.body.email});

    if (!user) {
        return next (new ErrorHandler("User not found with this email", 404));
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false })

    //create resset password URL
    const resetUrl =`${req.protocol}://${req.get("host")}/api/vi//password/reset/${resetToken}`;
    const message=`You password reset token is as follow:\n\n${resetUrl}\n\n If you have not requested this email, then ignore it.`
    try{

        await sendEmail({
            email: user.email,
            subject: "New Sun Motor Password Recovery",
            message
        })
        
        res.status(200).json({
            success:true,
            message: `Email sent to ${user.email}`
        })



    }catch (error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save ({validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }
})

