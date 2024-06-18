const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const MatchesSchema = new mongoose.Schema(
  {
    intern_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intern",
      required: true, // Added required
      autopopulate: {
        select: "_id firstName lastName",
        maxDepth: 2,
      },
    },
    matches: [
      {
        match_score: {
          type: Number,
          min: 0,
          max: 1,
          required: true,
        },
        advert_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Advert",
          required: true, // Added required
          autopopulate: {
            select: "_id title",
            maxDepth: 2,
          },
        },
      },
    ],
  },
  { id: false, timestamps: true }
);

MatchesSchema.plugin(autopopulate);

const Matches = mongoose.model("Matches", MatchesSchema);

module.exports = Matches;
