const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const internSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      autopopulate: {
        select: "_id username email phone",
        maxDepth: 1,
      },
    },
    firstName: String,
    lastName: String,
    birthDate: String,
    phoneNumber: String,
    address: String,
    university: String,
    department: String,
    class: String,
    average: Number,
    workExperience: [String],
    desiredField: String,
    skills: [String],
    languages: [String],
    teamWorkSkill: String,
    communicationSkill: String,
    analyticalSkill: String,
    hobbies: [String],
  },
  { id: false, timestamps: true }
);
internSchema.plugin(autopopulate);

const Intern = mongoose.model("Intern", internSchema);

module.exports = Intern;
