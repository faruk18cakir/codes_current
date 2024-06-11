const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Intern = require("../models/intern");
const Company = require("../models/company");
const Advert = require("../models/advert");
const Application = require("../models/application");
const config = require("config");
const moment = require("moment");
const { authenticateUser } = require("../../middlewares/autenticateUser");

router.post("/", authenticateUser, async (req, res) => {
  try {
    const { advert } = req.body;
    const { user } = req;

    if (user.role !== "intern") {
      return res
        .status(403)
        .send({ response: false, error: "Only interns can apply to adverts." });
    }

    if (!advert) {
      return res
        .status(400)
        .send({ response: false, error: "Advert is required." });
    }

    const dbAdvert = await Advert.findById(advert);
    if (!dbAdvert) {
      return res
        .status(404)
        .send({ response: false, error: "Advert not found." });
    }
    const newApplication = new Application({
      intern: user.intern,
      advert,
      status: "pending",
      isScored: false,
    });

    await newApplication.save();

    res
      .status(201)
      .send({ response: true, message: "Application successfully submitted." });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).send({
      response: false,
      error: "An error occurred while submitting the application.",
    });
  }
});

router.get("/advert/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    if (user.role !== "company") {
      return res.status(403).send({
        response: false,
        error: "Only companies can view applications.",
      });
    }
    const advert = await Advert.findOne({ _id: id, company: user.company });
    if (!advert) {
      return res
        .status(404)
        .send({ response: false, error: "Advert not found." });
    }

    const applications = await Application.find({ advert: id })
      .populate("intern")
      .populate("advert");
    res.status(200).send({ response: true, applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).send({
      response: false,
      error: "An error occurred while fetching the applications.",
    });
  }
});

router.patch("/accept/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    if (user.role !== "company") {
      return res.status(403).send({ response: false, error: "Only companies can accept applications." });
    }

    console.log(id)
    const application = await Application.findById(id).populate("advert");

    if (!application) {
      return res.status(404).send({ response: false, error: "Application not found." });
    }

    const advert = await Advert.findById(application.advert._id);

    if (advert.company.toString() !== user.company.toString()) {
      return res.status(403).send({ response: false, error: "Unauthorized to accept this application." });
    }

    application.status = "accepted";

    await application.save();

    res.status(200).send({ response: true, message: "Application successfully accepted.", application });
  } catch (error) {
    console.error("Error accepting application:", error);
    res.status(500).send({ response: false, error: "An error occurred while accepting the application." });
  }
});

// Get own applications
router.get("/own", authenticateUser, async (req, res) => {
  try {
    const { user } = req;

    let applications;
    if (user.role === "intern") {
      applications = await Application.find({ intern: user.intern })
        .populate("intern")
        .populate("advert");
    } else if (user.role === "company") {
      const adverts = await Advert.find({ company: user.company }).select("_id");
      applications = await Application.find({
        advert: { $in: adverts.map((advert) => advert._id) },
      })
        .populate("intern")
        .populate("advert");
    } else {
      return res
        .status(403)
        .send({ response: false, error: "Unauthorized access." });
    }

    res.status(200).send({ response: true, applications });
  } catch (error) {
    console.error("Error fetching own applications:", error);
    res.status(500).send({
      response: false,
      error: "An error occurred while fetching your applications.",
    });
  }
});

// Edit application by ID
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, score, isScored } = req.body;
    const { user } = req;

    if (user.role !== "company") {
      return res.status(403).send({
        response: false,
        error: "Only companies can edit applications.",
      });
    }

    const application = await Application.findById(id).populate("advert");

    if (!application) {
      return res
        .status(404)
        .send({ response: false, error: "Application not found." });
    }

    const advert = await Advert.findById(application.advert._id);

    if (advert.company.toString() !== user._id.toString()) {
      return res.status(403).send({
        response: false,
        error: "Unauthorized to edit this application.",
      });
    }

    application.status = status || application.status;
    application.score = score !== undefined ? score : application.score;
    application.isScored =
      isScored !== undefined ? isScored : application.isScored;

    await application.save();

    res.status(200).send({
      response: true,
      message: "Application successfully updated.",
      application,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).send({
      response: false,
      error: "An error occurred while updating the application.",
    });
  }
});

module.exports = router;
