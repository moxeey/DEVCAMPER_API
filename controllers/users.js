const asyncHandler=require("../middleware/async");
const ErrorResponse=require("../utils/errorResponse")
const User=require("../models/User");

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers=asyncHandler(async (req,res,next) => {
    res.status(200).send(res.advancedResults);
});

// @desc    Get single users
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser=asyncHandler(async (req,res,next) => {
    const user=await User.findById(req.params.id)
    if(!user) {
        return next(new ErrorResponse('User not found',404))
    }
    res.status(200).send({
        success: true,
        data: user
    });
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser=asyncHandler(async (req,res,next) => {
    const user=await User.create(req.body)
    res.status(201).send({
        success: true,
        data: user
    });
});


// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser=asyncHandler(async (req,res,next) => {
    const user=await User.findById(req.params.id)
    if(!user) {
        return next(new ErrorResponse('User not found',404))
    }
    await user.updateOne(req.body,{
        new: true,runValidators: true
    })
    res.status(200).send({
        success: true,
        data: user
    });
});


// @desc    Delete user
// @route   DELETE /api/v1/users
// @access  Private/Admin
exports.deleteUser=asyncHandler(async (req,res,next) => {
    const user=await User.findById(req.params.id)
    if(!user) {
        return next(new ErrorResponse('User not found',404))
    }
    user=await User.findByIdAndDelete(req.params.id)
    res.status(200).send({
        success: true,
        data: {}
    });
});