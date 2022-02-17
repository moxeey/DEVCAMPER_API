const { model, Schema } = require("mongoose");

const CourseSchema = Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add course description"],
  },
  description: {
    type: String,
    required: [true, "Please add course description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add course number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add course tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skills required"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
  // Calculating avg cost...

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  try {
    await model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: obj[0].averageCost,
    });
  } catch (error) {
    console.log(error);
  }
};

// Call getAverage after save
CourseSchema.post("save", function (doc) {
  this.constructor.getAverageCost(doc.bootcamp);
});

// Call getAverage before remove
CourseSchema.pre("remove", function (next) {
  this.constructor.getAverageCost(this.bootcamp);
  next();
});
module.exports = model("Course", CourseSchema);
