const jwt=require('jsonwebtoken')
const asyncHandler=require('./async')
const ErrorResponse=require('../utils/errorResponse')
const User=require('../models/User')


exports.protect=asyncHandler(async (req,res,next) => {
    let token
    const authHeader=req.headers.authorization

    // check auth header and cookie
    if(authHeader&&authHeader.startsWith('Bearer')) {
        // get token from Bearer token
        token=authHeader.split(' ')[1]
    }
    else if(req.cookies.token) {
        // get token from cookies
        token=req.cookies.token
    }
    else {
        // return 400, if the authorization header is not as expected.
        return next(new ErrorResponse('authorization is malformed',400))
    }

    // make sure token exist
    if(!token) return next(new ErrorResponse('token not found',401))

    try {
        // verify token
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=await User.findById(decoded.id)
        // the token is confirm with our secret code but the user was deleted.
        if(!req.user) return next(new ErrorResponse('The token is valid but the user does not exist',401))
        next()
    } catch(error) {
        // trying to access prohibited resources.
        return next(new ErrorResponse('not authorize to access this route',401))
    }


})

// grant access to specific roles
exports.authorize=(...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)) {
            // trying to access prohibited resources.
            return next(new ErrorResponse(`${req.user.role} is not authorized to access this resource`,403))
        }
        next()
    }
}