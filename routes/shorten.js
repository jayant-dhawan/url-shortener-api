const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const validURL = require('valid-url');
const redirectSchema = require('../models/redirects');
var baseURL = "localhost:8080/"

/* Handle GET Request */
router.get('/', (req, res) => {
  res.sendStatus(404);
});

/* Handle POST Request */
router.post('/', async (req, res) => {
  var redirect = req.body.url;
  var email = req.body.email;
  if(validURL.isUri(redirect)){
    var redirectid = await shortid.generate();
    const result = await redirectSchema.create({
      email,
      redirect,
      redirectid
    });
    var newURL = baseURL + result.redirectid;
    res.json({ "short-url" : newURL });
  } else {
    res.json("Not a valid URL!");
  }
});

module.exports = router;