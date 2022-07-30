const express=require("express");
const {model}=require("mongoose");
const router=express.Router();

// Controller files
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
}=require("../controllers/bootcamps");

const Bootcamp=require("../models/Bootcamp");
const advancedResults=require("../middleware/advancedResults")
const {protect,authorize}=require("../middleware/auth");

// Include other router resources
const courseRouter=require("./courses");

// Re-route into other resource routers
router.use("/:bootcampId/courses",courseRouter);

// connect the controllers
router
  .route("/")
  .get(advancedResults(Bootcamp,"courses"),getBootcamps)
  .post(protect,authorize('publisher','admin'),createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect,authorize('publisher','admin'),updateBootcamp)
  .delete(protect,authorize('publisher','admin'),deleteBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/:id/photo").put(protect,bootcampPhotoUpload);

module.exports=router;
