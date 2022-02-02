// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = (req, res, next) => {
  res.status(200).send({
    success: true,
    msg: "List of all bootcamps",
  });
};

// @desc    Get a bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  public
exports.getBootcamp = (req, res, next) => {
  res.status(200).send({
    success: true,
    msg: `show bootcamp ${req.params.id}`,
  });
};

// @desc    create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  private
exports.createBootcamp = (req, res, next) => {
  res.status(201).send({
    success: true,
    msg: "bootcamp created successfully",
  });
};

// @desc    update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).send({
    success: true,
    msg: `bootcamp ${req.params.id} updated successfully`,
  });
};

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).send({
    success: true,
    msg: `bootcamp ${req.params.id} deleted successfully`,
  });
};
