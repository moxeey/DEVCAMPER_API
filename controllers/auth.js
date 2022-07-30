const asyncHandler=require("../middleware/async");
const Bootcamp=require("../models/Bootcamp");
const User=require("../models/User");
const ErrorResponse=require("../utils/errorResponse")

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
    sendTokenresponse(user,200,res)
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
    sendTokenresponse(user,200,res)

});


// get token from model, create cookie and send message
const sendTokenresponse=(user,statusCode,res) => {
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