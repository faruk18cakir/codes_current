const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");


const applicationSchema = new mongoose.Schema(
  {
    intern: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intern",
      autopopulate: {
        select: "_id firstName lastName user",
        maxDepth: 1,
      },
    },
    advert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advert",
      autopopulate: {
        select: "_id title company",
        maxDepth: 2,
      },
    },
    status: String,
    score: Number,
    isScored: Boolean,
  },
  { id: false, timestamps: true }
);
applicationSchema.plugin(autopopulate);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
