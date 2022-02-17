const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).send({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).send(res.advancedResults);
  }
});

// @desc    Get a single courses
// @route   GET /api/v1/courses/:id
// @access  public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description location.city",
  });

  if (!course) {
    next(new ErrorResponse(404, `Can't find course with id ${req.params.id}`));
  }

  res.status(200).send({
    success: true,
    data: course,
  });
});

// @desc    Add a single courses
// @route   POST /api/v1/bootcamps/:bootcampId/courses/:id
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(404, `Can't find bootcamp with id ${req.params.id}`)
    );
  }
  const course = await Course.create(req.body);

  res.status(200).send({
    success: true,
    data: course,
  });
});

// @desc    Update a single courses
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(404, `Can't find course with id ${req.params.id}`)
    );
  }
  course = await Course.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).send({
    success: true,
    data: course,
  });
});

// @desc    Delete a single courses
// @route   Delete /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(404, `Can't find course with id ${req.params.id}`)
    );
  }
  await course.remove();
  res.status(200).send({
    success: true,
    data: {},
  });
});
