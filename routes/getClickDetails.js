const express = require('express');
const router = express.Router();
const redirectClicks = require('../models/redirectClicks');
const redirectsSchema = require('../models/redirects');

/* Handle GET Request to get click count for a redirect */
router.get('/count/:redirectid', async (req, res) => {
  var userEmail = req.user.email;
  var redirectid = req.params.redirectid;

  //Check for empty email
  //if(!userEmail) res.sendStatus(401);

  //Get click count from the database
  if (validateUser(userEmail, redirectid)) {
    redirectClicks.countDocuments({ redirectid }, (error, count) => {
      if (error) {
        res.json({ error: error.status });
      }
      if(count){
        res.json({ status: "successfull", count });
      }
    })
  } else {
    res.sendStatus(401);
  }
});

/* Handle GET Request to get all the details for the clicks of a short url */
router.get('/details/:redirectid', (req, res) => {
  var userEmail = req.user.email;
  var redirectid = req.params.redirectid;

  //Check for empty email
  //if (!userEmail) return res.sendStatus(401);

  //Get click details from the database
  if (validateUser(userEmail, redirectid)) {
    redirectClicks.find({ redirectid }, (error, linkDetails) => {
      if (error) {
        return res.json({ error: error.status });
      }
      if(linkDetails) {
        return res.json({ status: "successfull", linkDetails });
      }
    })
  } else {
    res.sendStatus(401);
  }
});

//Function to validate the user before hanfdling the request
async function validateUser(user, redirectid) {
  const response = await redirectsSchema.findOne({ redirectid });
  if (user == response.email) {
    return true;
  }
  else
    return false;
}

module.exports = router;
