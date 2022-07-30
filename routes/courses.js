const express=require("express");
const router=express.Router({mergeParams: true});

const Course=require("../models/Course");
const advancedResults=require("../middleware/advancedResults");
const {protect,authorize}=require("../middleware/auth");

// Controller files
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
}=require("../controllers/courses");

// connect the controllers
router
  .route("/")
  .get(
    advancedResults(Course,{
      path: "bootcamp",
      select: "name description location.city",
    }),
    getCourses
  )
  .post(protect,authorize('publisher','admin'),addCourse);
router.route("/:id").get(getCourse).put(protect,authorize('publisher','admin'),updateCourse).delete(protect,authorize('publisher','admin'),deleteCourse);

module.exports=router;
