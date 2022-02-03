const mongoose = require("mongoose");

const BootcampSchema = mongoose.Schema({
  name: {
    required: [true, "Please add a name"],
    type: String,
    unique: true,
    trim: true,
    maxlenght: [50, "Name cannot be more than 50 character"],
  },
  slug: String,
  description: {
    required: [true, "Please add a description"],
    type: String,
    unique: true,
    trim: true,
    maxlenght: [200, "Description cannot be more than 200 character"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with http or https",
    ],
  },
  phone: {
    type: String,
    maxlenght: [20, "Phone number cannot be longer than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Enter a valid email address",
    ],
  },
  address: {
    type: String,
    required: [true, "Address cannot be blank"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
      //   required: true,
    },
    coordinates: {
      type: Number,
      //   required: true,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    //   Array of Strings
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Business",
      "Data Science",
    ],
  },
  averageRatings: {
    type: Number,
    min: [1, "Rating must be atleast 1"],
    max: [10, "Rating must not ne more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuaranty: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
