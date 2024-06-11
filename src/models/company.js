const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");


const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      select: "_id username email",
      autopopulate: true,
    },
    companyName: String,
    about: String,
    phoneNumber: String,
    faxNumber: String,
    address: String,
    sector: String,
    taxNumber: String,
  },
  { id: false, timestamps: true }
);
companySchema.plugin(autopopulate);


const Company = mongoose.model("Company", companySchema);

module.exports = Company;
