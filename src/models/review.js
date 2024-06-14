const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      autopopulate: {
        select: "_id companyName",
        maxDepth: 2,
      },
    },
    intern: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intern",
      autopopulate: {
        select: "_id firstName lastName",
        maxDepth: 2,
      },
    },
    advert: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Advert",
        autopopulate: {
          select: "_id title",
          maxDepth: 2,
        },
      },
    reviewer: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { id: false, timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
