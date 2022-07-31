const crypto=require('crypto')
const asyncHandler=require("../middleware/async");
const User=require("../models/User");
const ErrorResponse=require("../utils/errorResponse")
const sendEmail=require('../utils/sendEmail')
// @desc    register user
// @route   GET /api/v1/auth/register
// @access  public
exports.register=asyncHandler(async (req,res,next) => {
    const {name,email,password,role}=req.body

    // create user
    const user=await User.create({
        name,email,password,role
    })

    // send token response
    sendTokenResponse(user,200,res)
});

// @desc    login user
// @route   POST /api/v1/auth/login
// @access  public
exports.login=asyncHandler(async (req,res,next) => {
    const {email,password}=req.body
    // validate email and passsword
    if(!email||!password) {
        return next(new ErrorResponse('Please provide both email and password',400))
    }
    // Check for user
    const user=await User.findOne({email: email}).select('+password')
    if(!user) {
        return next(new ErrorResponse(`Invalid credentials`,401))
    }

    // Check if the password is correct
    const isMatched=await user.matchPassword(password)
    if(!isMatched) {
        return next(new ErrorResponse(`Invalid credentials`,401))
    }

    // send token response
    sendTokenResponse(user,200,res)

});

// @desc    get current user
// @route   POST /api/v1/auth/me
// @access  private
exports.getMe=asyncHandler(async (req,res,next) => {
    const user=await User.findById(req.user.id);

    res.status(200).send({
        success: true,
        data: user
    })
})


// @desc    update user details
// @route   POST /api/v1/auth/updateDetails
// @access  private
exports.updateDetails=asyncHandler(async (req,res,next) => {
    const fieldsToUpdate={
        email: req.body.email,
        name: req.body.name
    }
    const user=await User.findByIdAndUpdate(req.user.id,fieldsToUpdate,{
        new: true,
        runValidators: true
    });

    res.status(200).send({
        success: true,
        data: user
    })
})

// @desc    update user password
// @route   POST /api/v1/auth/updatePassword
// @access  private
exports.updatePassword=asyncHandler(async (req,res,next) => {
    const {currentPassword,newPassword}=req.body;
    const user=await User.findById(req.user.id).select('+password')
    // validate email and passsword
    if(!newPassword||!currentPassword) {
        return next(new ErrorResponse('Please provide both current and new password',400))
    }
    const isMatched=await user.matchPassword(currentPassword)

    if(!isMatched) {
        return next(new ErrorResponse('Current password is invalid',401))
    }

    user.password=newPassword;
    await user.save()

    sendTokenResponse(user,200,res)
})

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  public
exports.forgotPassword=asyncHandler(async (req,res,next) => {
    const {email}=req.body
    if(!email) {
        return next(new ErrorResponse('Email is required',400))
    }
    const user=await User.findOne({email: email});
    if(!user) {
        return next(new ErrorResponse(`There is no user with the given email`,404))
    }

    // get reset token
    const resetToken=await user.getResetPasswordToken()

    await user.save({validateBeforeSave: false})
    // create reset url 
    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`
    const message=`you are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n${resetUrl}`
    // send email
    try {
        await sendEmail({
            email: user.email,
            subject: 'password reset token',
            message
        })
        res.status(200).send({
            success: true,
            data: 'Email sent'
        })
    } catch(error) {
        console.log(error)
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined

        await user.save({validateBeforeSave: false})
        return next(new ErrorResponse('Email could not be sent',500))
    }

})

// @desc    Reset password
// @route   POST /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword=asyncHandler(async (req,res,next) => {
    // get hashed token
    const resetPasswordToken=crypto.createHash('sha256').update(req.params.resettoken).digest('hex')

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });

    if(!user) {
        return next(new ErrorResponse('Invalid token',400))
    }
    // set new password
    user.password=req.body.password
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined
    await user.save({validateBeforeSave: false})

    sendTokenResponse(user,200,res)
})

// get token from model, create cookie and send message
const sendTokenResponse=(user,statusCode,res) => {
    // create token 
    const token=user.getSignedJwtToken()
    const options={
        expires: new Date(Date.now+(process.env.JWT_COOKIE_EXPIRE*24*60*60*1000)),
        httpOnly: true
    }
    if(process.env.NODE_ENV==='production') {
        options.secure=true
    }
    res
        .status(statusCode)
        .cookie('token',token,options)
        .send({success: true,token});

}
