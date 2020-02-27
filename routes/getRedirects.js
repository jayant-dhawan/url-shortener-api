const express = require('express');
const router = express.Router();
const redirectSchema = require('../models/redirects');

/* Handle GET Request to get all the short links for the user */
router.get('/', (req, res) => {
  var email = req.user.email;
  if(email) {
    redirectSchema.find({ email }, { '_id': 0, '__v': 0 }, (error, redirects) => { //Find all the redirects from the database for the user
      if(error){
        res.json({ error: error.status });
      }
      if(redirects)
        res.json({ status: "successfull", redirects }); //Return all the redirects
      else res.json({ status: "No redirects found" }); //Return not found if redirects is empty
    })
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;