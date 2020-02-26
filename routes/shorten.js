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
  if (validURL.isUri(redirect)) {
    var redirectid = await shortid.generate();
    await redirectSchema.create({
      email,
      redirect,
      redirectid,
      customRedirect: redirectid
    }, (error, result) => {
    if(error){
      res.send(error);
    } else if(result.redirectid) {
      var newURL = baseURL + result.redirectid;
      res.json({ "shortUrl": newURL });
    } else {
      res.json("error");
    }
    });
  } else {
    res.json("Not a valid URL!");
  }
});

router.post('/custom/:id', async (req, res) => {
  var redirectid = req.params.id;
  var user = req.user.email;
  var custom = req.body.custom;
  if (await validateUser(user, redirectid)) {
    var response = await redirectSchema.findOne({ redirectid });
    if (response.redirectid == redirectid) {
      if (!response.custom) {
        redirectSchema.updateOne({ "redirectid": redirectid },
          {
            $set: {
              "customRedirect": custom
            }
          }).then(data => {
            console.log(data);
            if (data.nModified == 0) {
              res.json("Custom url exist");
            } else {
              res.json("Successfull");
            }
          }).catch(error => {
            res.json("There is an error");
          })
      } else {
        res.json("Custom URL already set");
      }
    }

  } else {
    res.sendStatus(401);
  }
});

async function validateUser(user, redirectid) {
  const response = await redirectSchema.findOne({ redirectid });
  if (user == response.email) {
    return true
  }
  else return false
}

module.exports = router;