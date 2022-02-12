const { param } = require("express/lib/request");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // Copy requet query
  let reqQuery = { ...req.query };

  // Fields to exclude
  let removeFields = ["select", "sort"];

  // loop over remove fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators ($gt, $gte, $lt, etc)
  queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  // finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  // Select field
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Executing query
  const bootcamps = await query;
  res.status(200).send({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc    Get a bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp)
    return next(
      new ErrorResponse(`Can't find bootcamp with ID ${req.params.id}`, 404)
    );

  res.status(200).send({
    success: true,
    data: bootcamp,
  });
});

// @desc    create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).send({
    success: true,
    data: bootcamp,
  });
});

// @desc    update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp)
    return next(
      new ErrorResponse(`Can't find bootcamp with ID ${req.params.id}`, 404)
    );
  res.status(200).send({
    success: true,
    data: bootcamp,
  });
});

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp)
    return next(
      new ErrorResponse(`Can't find bootcamp with ID ${req.params.id}`, 404)
    );
  res.status(200).send({
    success: true,
    data: {},
  });
});

// @desc    Get bootcamps within radius
// @route   DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access  private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calculte radius using radians
  // divide distance by radius of earth
  // radius of earth =3,963 mi or 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).send({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
