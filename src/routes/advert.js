const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Intern = require("../models/intern");
const Company = require("../models/company");
const Advert = require("../models/advert");
const config = require("config");
const moment = require("moment");
const { authenticateUser } = require("../../middlewares/autenticateUser");

router.post("/create", authenticateUser, async (req, res) => {
  try {
    const { title, field, requirements, foreignLanguages, department } =
      req.body;

    const { user } = req;
    if (user.role !== "company") {
      return res
        .status(403)
        .send({ response: false, error: "Only companies can create adverts." });
    }
    console.log(user);
    const advert = await Advert.findOne({ title });
    if (advert) {
      return res
        .status(400)
        .send({ response: false, error: "Advert already exists." });
    }
    // Basic validation
    if (!title || !field || !requirements || !foreignLanguages || !department) {
      return res.status(400).send({
        response: false,
        error:
          "All fields are required: company, title, field, requirements, foreignLanguages, and department.",
      });
    }

    // Create new advert
    const newAdvert = new Advert({
      company: user.company,
      title,
      field,
      requirements,
      foreignLanguages,
      department,
    });

    await newAdvert.save();

    res
      .status(201)
      .send({ response: true, message: "Advert successfully added." });
  } catch (error) {
    console.error("Error adding Advert:", error);
    res.status(500).send({
      response: false,
      error: "An error occurred while adding the Advert.",
    });
  }
});

router.get("/", authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res
        .status(403)
        .send({ response: false, error: "You are unauthorized." });
    }
    const adverts = await Advert.find();
    res.status(200).send({ response: true, adverts });
  } catch (error) {
    console.error("Error fetching adverts:", error);
    res.status(500).send({
      response: false,
      error: "An error occurred while fetching the adverts.",
    });
  }
});

// Get own adverts
router.get("/own", authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res
        .status(403)
        .send({ response: false, error: "You are unauthorized." });
    }
    if (user.role !== "company") {
      return res.status(403).send({
        response: false,
        error: "Only companies can get own adverts.",
      });
    }
    const adverts = await Advert.find({ company: user.company });
    res.status(200).send({ response: true, adverts });
  } catch (error) {
    console.error("Error fetching own adverts:", error);
    res.status(500).send({
      response: false,
      error: "An error occurred while fetching your adverts.",
    });
  }
});

router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res
        .status(403)
        .send({ response: false, error: "You are unauthorized." });
    }
    const advert = await Advert.findOne({ _id: req.params.id });
    res.status(200).send({ response: true, advert });
  } catch (error) {
    console.error("Error fetching own adverts:", error);
    res.status(500).send({
      response: false,
      error: "An error occurred while fetching your adverts.",
    });
  }
});

// Edit advert by ID
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res
        .status(403)
        .send({ response: false, error: "You are unauthorized." });
    }
    if (user.role !== "company") {
      return res.status(403).send({
        response: false,
        error: "Only companies can get own adverts.",
      });
    }
    const advert = await Advert.findById(req.params.id);
    if (!advert) {
      return res
        .status(404)
        .send({ response: false, error: "Advert not found." });
    }
    const { id } = req.params;
    const {
      title,
      field,
      requirements,
      foreignLanguages,
      department,
    } = req.body;

    // Basic validation
    if (
      !title ||
      !field ||
      !requirements ||
      !foreignLanguages ||
      !department
    ) {
      return res.status(400).send({
        response: false,
        error:
          "All fields are required: title, field, requirements, foreignLanguages, and department.",
      });
    }

    const updatedAdvert = await Advert.findByIdAndUpdate(
      id,
      { title, field, requirements, foreignLanguages, department },
      { new: true, runValidators: true }
    );

    if (!updatedAdvert) {
      return res
        .status(404)
        .send({ response: false, error: "Advert not found." });
    }

    res.status(200).send({
      response: true,
      message: "Advert successfully updated.",
      advert: updatedAdvert,
    });
  } catch (error) {
    console.error("Error updating advert:", error);
    res.status(500).send({
      response: false,
      error: "An error occurred while updating the advert.",
    });
  }
});

module.exports = router;
