const asyncHandler=require("../middleware/async");
const Bootcamp=require("../models/Bootcamp");
const geocoder=require("../utils/geocoder");
const ErrorResponse=require("../utils/errorResponse");
const path=require("path");
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps=asyncHandler(async (req,res,next) => {
  res.status(200).send(res.advancedResults);
});

// @desc    Get a bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  public
exports.getBootcamp=asyncHandler(async (req,res,next) => {
  const bootcamp=await Bootcamp.findById(req.params.id).populate({
    path: "courses",
  });
  if(!bootcamp)
    return next(
      new ErrorResponse(`Can't find bootcamp with ID ${req.params.id}`,404)
    );

  res.status(200).send({
    success: true,
    data: bootcamp,
  });
});

// @desc    create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  private
exports.createBootcamp=asyncHandler(async (req,res,next) => {
  // add user to the bootcamp
  req.body.user=req.user.id

  // check for puvlished bootcamp
  const publishedBootcamp=await Bootcamp.findOne({user: req.user.id})

  // check if the user is not admin, they cannot add more than one bootcamp
  if(publishedBootcamp&&req.user.role!=='admin') {
    return next(new ErrorResponse(`The user has already published a bootcamp`,400))
  }

  const bootcamp=await Bootcamp.create(req.body);
  res.status(201).send({
    success: true,
    data: bootcamp,
  });
});

// @desc    update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  private
exports.updateBootcamp=asyncHandler(async (req,res,next) => {
  user=req.user.id
  let bootcamp=await Bootcamp.findById(req.params.id);
  if(!bootcamp)
    return next(
      new ErrorResponse(`Can't find bootcamp with ID ${req.params.id}`,404)
    );

  // make sure the user pubilsh this bootcamp
  if(bootcamp.user.toString()!==req.user.id&&req.user.role!=='admin') {
    return next(new ErrorResponse(`user ${req.user.name} is not authorized to update this bootcamp`,401))
  }

  bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
    new: true,
    runValidators: true,
  });
  res.status(200).send({
    success: true,
    data: bootcamp,
  });
});

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp=asyncHandler(async (req,res,next) => {
  const bootcamp=await Bootcamp.findById(req.params.id);
  if(!bootcamp)
    return next(
      new ErrorResponse(`Can't find bootcamp with ID ${req.params.id}`,404)
    );
  // make sure the user pubilsh this bootcamp
  if(bootcamp.user.toString()!==req.user.id&&req.user.role!=='admin') {
    return next(new ErrorResponse(`user ${req.user.name} is not authorized to delete this bootcamp`,401))
  }

  bootcamp.remove();
  res.status(200).send({
    success: true,
    data: {},
  });
});

// @desc    Get bootcamps within radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  private
exports.getBootcampsInRadius=asyncHandler(async (req,res,next) => {
  const {zipcode,distance}=req.params;

  // Get lat/lng from geocoder
  const loc=await geocoder.geocode(zipcode);
  const lat=loc[0].latitude;
  const lng=loc[0].longitude;

  // calculte radius using radians
  // divide distance by radius of earth
  // radius of earth =3,963 mi or 6,378 km
  const radius=distance/3963;

  const bootcamps=await Bootcamp.find({
    location: {$geoWithin: {$centerSphere: [[lng,lat],radius]}},
  });

  res.status(200).send({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc    Upload a photo
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  private
exports.bootcampPhotoUpload=asyncHandler(async (req,res,next) => {

  const bootcamp=await Bootcamp.findById(req.params.id);
  if(!bootcamp)
    return next(
      new ErrorResponse(`Can't find bootcamp with ID ${req.params.id}`,404)
    );
  // make sure the user pubilsh this bootcamp
  if(bootcamp.user.toString()!==req.user.id&&req.user.role!=='admin') {
    return next(new ErrorResponse(`user ${req.user.name} is not authorized to delete this bootcamp`,401))
  }
  if(!req.files) return next(new ErrorResponse("Please upload files",400));

  const file=req.files.file;


  // Make sure the file is a photo
  if(!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload image file",400));
  }

  if(file.size>process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // create custom file name
  file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async (err) => {
    console.log(err);

    if(err) {
      return next(new ErrorResponse(`Problem with file upload`,500));
    }
    // save file url in database.
    await Bootcamp.findByIdAndUpdate(req.params.id,{photo: file.name});
    res.status(200).send({success: true,data: file.name});
  });
});
