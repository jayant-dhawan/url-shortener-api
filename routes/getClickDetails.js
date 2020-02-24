const express = require('express');
const router = express.Router();
const redirectClicks = require('../models/redirectClicks');
const redirectsSchema = require('../models/redirects');

/* Handle GET Request */
router.get('/count/:redirectid', async (req, res) => {
  var userEmail = req.user;
  var redirectid = req.params.redirectid;
  if (await validateUser(userEmail, redirectid)) {
    redirectClicks.countDocuments({ redirectid }, (error, count) => {
      if (error) {
        res.send(error);
      }
      res.json(count);
    })
  } else {
    res.sendStatus(401)
  }
});

/* Handle GET Request */
router.get('/details/:redirectid', async (req, res) => {
  var userEmail = req.user;
  var redirectid = req.params.redirectid;
  if (await validateUser(userEmail, redirectid)) {
    redirectClicks.find({ redirectid }, (error, response) => {
      if (error) {
        res.send(error);
      }
      res.json(response);
    })
  } else {
    res.sendStatus(401)
  }
});

async function validateUser(user, redirectid) {
  const response = await redirectsSchema.findOne({ redirectid });
  if (user.email == response.email) {
    return true
  }
  return false
}

module.exports = router;
