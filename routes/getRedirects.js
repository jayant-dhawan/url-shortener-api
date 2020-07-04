const express = require('express');
const router = express.Router();
const redirectSchema = require('../models/redirects');
const details = require('../models/redirectClicks');

/* Handle GET Request to get all the short links for the user */
router.get('/', (req, res) => {
  var email = req.user.email;
  if(email) {
    redirectSchema.find({ email }, { '_id': 0, '__v': 0 }, (error, redirects) => { //Find all the redirects from the database for the user
      if(error){
        res.json({ error: error.status });
        return;
      }
      if(redirects)
        res.json({ status: "successfull", redirects }); //Return all the redirects
      else res.json({ status: "no redirects found" }); //Return not found if redirects is empty
    })
  } else {
    res.sendStatus(401);
  }
});

/* Handle DELETE Request to delete a the short link */
router.delete('/', async (req, res) => {
  const id = req.query.id;

  if(id == null) {
    res.json({ message: 'Short URL id is empty.', status: 'Failed' });
  }

  const response = await redirectSchema.deleteOne({ redirectid: id });
  await details.deleteMany({ redirectid: id });

  if(response.deletedCount > 0) {
    res.json({ message: 'Short URL deleted', status: 'Successfull' });
  } else if(response.n == 0) {
    res.json({ message: 'Short URL not found', status: 'Failed' });
  } else {
    res.json({ message: 'Short URL not deleted', status: 'Failed' });
  }
});

module.exports = router;