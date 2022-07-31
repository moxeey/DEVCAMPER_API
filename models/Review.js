const mongoose=require('mongoose')

const ReviewSchema=mongoose.Schema({
    title: {
        type: String,
        required: [true,'please add title'],
        trim: true,
        maxlength: [100,'title cannot be more than 50 characters']
    },
    text: {
        type: String,
        required: [true,'Please add review text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true,'Please add rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: [true,'Please add bootcamp reference']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true,'Please add bootcamp reference']
    }
})

// Prevent users from submitting more than one review in a bootcamp
ReviewSchema.index({bootcamp: 1,user: 1},{unique: true})

ReviewSchema.statics.getAverageRating=async function(bootcampId) {
    // Calculating avg Rating...

    const obj=await this.aggregate([
        {
            $match: {bootcamp: bootcampId},
        },
        {
            $group: {
                _id: "$bootcamp",
                averageRating: {$avg: "$rating"},
            },
        },
    ]);

    try {
        await mongoose.model("Bootcamp").findByIdAndUpdate(bootcampId,{
            averageRating: obj[0].averageRating,
        });
    } catch(error) {
        console.log(error);
    }
};

// Call getAverage after save
ReviewSchema.post("save",function(review) {
    this.constructor.getAverageRating(review.bootcamp);
});

// Call getAverage before remove
ReviewSchema.pre("remove",function(next) {
    this.constructor.getAverageRating(this.bootcamp);
    next();
});
module.exports=mongoose.model('Review',ReviewSchema)