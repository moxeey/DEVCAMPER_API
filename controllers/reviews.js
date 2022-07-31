const asyncHandler=require("../middleware/async");
const ErrorResponse=require("../utils/errorResponse");
const Bootcamp=require("../models/Bootcamp");
const Review=require("../models/Review");

// @desc    Get reivews
// @route   GET /api/v1/reviews
// @access  public
exports.getReviews=asyncHandler(async (req,res,next) => {
    if(req.params.bootcampId) {
        const reviews=await Review.find({bootcamp: req.params.bootcampId});
        return res.status(200).send({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } else {
        res.status(200).send(res.advancedResults);
    }
});

// @desc    Get single reivew
// @route   GET /api/v1/reviews/:id
// @access  public
exports.getReview=asyncHandler(async (req,res,next) => {
    const review=await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description location.city'
    });

    if(!review) {
        return next(new ErrorResponse('Review not found',404))
    }
    return res.status(200).send({
        success: true,
        data: review,
    });

});

// @desc    Add reivew
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  private
exports.addReview=asyncHandler(async (req,res,next) => {
    const bootcamp=await Bootcamp.findById(req.params.bootcampId)
    if(!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with ID: ${req.params.bootcampId} not found`,404))
    }
    req.body.bootcamp=req.params.bootcampId
    req.body.user=req.user.id
    const review=await Review.create(req.body)

    return res.status(200).send({
        success: true,
        data: review,
    });

});

// @desc    Update reivew
// @route   PUT /api/v1/reviews/:id
// @access  private
exports.updateReview=asyncHandler(async (req,res,next) => {
    let review=await Review.findById(req.params.id)
    if(!review) {
        return next(new ErrorResponse(`Review with ID: ${req.params.id} not found`,404))
    }

    // make sure review belong to the user or he's an admin
    if(review.user.toString()!==req.user.id&&req.user.role!=='admin') {
        return next(new ErrorResponse(`User not authorized to update this review`,401))
    }
    review=await Review.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true
    })
    await review.save();

    return res.status(200).send({
        success: true,
        data: review,
    });

});

// @desc    Delete reivew
// @route   DELETE /api/v1/reviews/:id
// @access  private
exports.deleteReview=asyncHandler(async (req,res,next) => {
    let review=await Review.findById(req.params.id)
    if(!review) {
        return next(new ErrorResponse(`Review with ID: ${req.params.id} not found`,404))
    }

    // make sure review belong to the user or he's an admin
    if(review.user.toString()!==req.user.id&&req.user.role!=='admin') {
        return next(new ErrorResponse(`User not authorized to delete this review`,401))
    }
    await review.remove()

    return res.status(200).send({
        success: true,
        data: {},
    });

});
