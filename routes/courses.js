const express = require("express");
const router = express.Router({ mergeParams: true });

const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");

// Controller files
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

// connect the controllers
router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description location.city",
    }),
    getCourses
  )
  .post(addCourse);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
