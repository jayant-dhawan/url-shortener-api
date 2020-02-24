const express = require('express');
const router = express.Router();
const redirectSchema = require('../models/redirects');

/* Handle GET Request */
router.get('/', (req, res) => {
  var email = req.user.email;
  if(ValiditeEmail(email)) {
    redirectSchema.find({ email }, { '_id': 0, '__v': 0 }, (error, redirects) => {
      if(error){
        res.json("No links found");
      }
      res.json(redirects);
    })
  }
});

function ValiditeEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return (true)
  }
  return (false)
}

module.exports = router;