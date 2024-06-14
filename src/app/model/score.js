import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  advert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advert",
    autopopulate: {
      select: "_id title company",
      maxDepth: 2,
    },
  },
  message: { type: String, required: true },
  rating: { type: Number, required: true },
  intern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern",
    autopopulate: {
      select: "_id firstName lastName",
      maxDepth: 1,
    },
  },
});

export default scoreSchema;
