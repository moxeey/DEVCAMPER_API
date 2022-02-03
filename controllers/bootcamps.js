const Bootcamp = require("../models/Bootcamp");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).send({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (err) {
    res.status(500).send({ success: false, msg: err.message });
  }
};

// @desc    Get a bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) return res.status(400).send({ success: false });
    res.status(200).send({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).send({ success: false, msg: err.message });
  }
};

// @desc    create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).send({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).send({ success: false, msg: err.message });
  }
};

// @desc    update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) return res.status(400).send({ success: false });
    res.status(200).send({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).send({ success: false, msg: err.message });
  }
};

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) return res.status(400).send({ success: false });
    res.status(200).send({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).send({ success: false, msg: err.message });
  }
};
