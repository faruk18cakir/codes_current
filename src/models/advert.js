const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const advertSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      autopopulate: {
        select: "_id companyName",
        maxDepth: 2,
      },
    },
    title: String,
    field: String,
    requirements: String,
    foreignLanguages: String,
    department: String,
  },
  { id: false, timestamps: true }
);
advertSchema.plugin(autopopulate);


const Advert = mongoose.model("Advert", advertSchema);

module.exports = Advert;
