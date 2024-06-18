const express = require("express");
const router = express.Router();
const Matches = require("../models/match");
const Application = require("../models/application");
const { authenticateUser } = require("../../middlewares/autenticateUser");

router.get("/", authenticateUser, async (req, res) => {
  try {
    const { user } = req;

    const matches = await Matches.findOne({
      $or: [{ intern_id: user.intern }, { intern_id: user.id }],
    });
    matchArray = [];
    for (let m of matches.matches) {
      let isApplied = false;

      const application = await Application.exists({
        advert: m.advert_id._id,
        intern: user.intern,
      });
      if (application) {
        isApplied = true;
      }
      let obj = { ...m.toObject(), isApplied };
      matchArray.push(obj);
    }
    res.status(200).json({ matches: matchArray });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
