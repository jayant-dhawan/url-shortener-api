const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const validURL = require('valid-url');
const redirectSchema = require('../models/redirects');
var baseURL = process.env.SHORTURL || "http://localhost:5000/";

/* Handle GET Request */
router.get('/', (req, res) => {
  res.sendStatus(404);
});

/* Handle POST Request to generate short URL*/
router.post('/', async (req, res) => {
  var redirect = req.body.url;
  var email = req.user.email;
  
  //Check for empty URL and Email feilds
  if(!redirect) return res.json({ emptyURL: "url feild is empty" });
  if(!email) return res.json( { emptyEmail: "email feild is empty" });

  //Shorten url is genereated here
  if (validURL.isUri(redirect)) {
    var redirectid = await shortid.generate(); // Generate ShordIDs mapped every url
    //Add that shortid and URL to database
    await redirectSchema.create({
      email, // email of the account who is generating short url
      redirect, // original link of the short url where it is redirected
      redirectid, // shortid of the shortened url
      customRedirect: redirectid // custom url if set by the user (Optional)
    }, (error, result) => {
    if(error){
      res.json({ errorStatus: error.status });
    } else if(result.redirectid) {
      var newURL = baseURL + result.redirectid; //return shorten url
      res.json({ "shortUrl": newURL });
    } else {
      res.json({ errorMessage : "there is an error" }); // return error if any
    }
    });
  } else {
    res.json({ invalidUrl: "Not a valid URL!" }); //return error if url is not valid
  }
});

/* Handle POST request for empty custom URL */
router.post('/custom', (req, res) => {
  res.json({ emptyShortURL: "short url feild is empty" });
});

/* Handle POST request to generate custom URL of already generated short URL */
router.post('/custom/:id', async (req, res) => {
  var redirectid = req.params.id;
  var user = req.user.email;
  var custom = req.body.custom;

  //Check for empty req feilds
  if(!redirectid) return res.json({ emptyShortURL: "short url feild is empty" });
  if(!user) return res.json( { emptyEmail: "email feild is empty" });
  if(!custom) return res.json({ emptyCustomURL: "custom url feild is empty" });

  //Custom url for a short url is generated here
  if (await validateUser(user, redirectid)) {
    var response = await redirectSchema.findOne({ redirectid }); // find the short url in database
    if (response.redirectid == redirectid) { 
      if (response.customRedirect == redirectid) {
        redirectSchema.updateOne({ "redirectid": redirectid }, //update the customURL feild in database
          {
            $set: {
              "customRedirect": custom
            }
          }).then(data => {
            if (data.nModified == 0) {
              res.json({ status: "custom url not available try another" }); //Return if custom url is not available
            } else {
              res.json({ status: "successfull", customUrl: baseURL + "r/" + custom }); // Return Successfull message if custom url is generated
            }
          }).catch(error => {
            res.json({ error: error.status });
          })
      } else {
        res.json({ status: "custom url already set"}); //Return if custom url already set
      }
    }

  } else {
    res.sendStatus(401);
  }
});

/* function to validate user before processing the request */
async function validateUser(user, redirectid) {
  const response = await redirectSchema.findOne({ redirectid });
  if (user == response.email) {
    return true
  }
  else return false
}

module.exports = router;
