var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', (req, res) => {
  res.sendStatus(404);
})

/* Handling get request to verify email of a user */
router.get('/:id', async (req, res) => {
  var email = req.query.email;
  var token = req.params.id;

  //check for empty email and token
  if(!email) return res.json({ emptyEmail: "no email received" });
  if(!token) return res.json({ emptyToken: "no token received" });

  //Find the email in database to verify and match the token in databse with received token
  await User.findOne({ email }, (err, user) => {
    if (err) {
      res.json({ error: err.status });
    }
    if (token && !user.verified && token == user.token) { //If token matched then update the status of the user
      User.updateOne({ email }, { $set: { verified: true }, $unset: { token: "" } }, (error, response) => {
        if (error) {
          res.json({ error: error.status });
        }
        if (response.nModified > 0) {
          res.json({ status: "verified" }); //Send status  
        } else {
          res.json({ status: "not verified" }); //Send status
        }
      })
    } else if(user.verified) {
      res.json({ status: "user already verified" }); //Send status
    } else { 
      res.json({ status: "not verified" }); //Send status
    }
  });
});

module.exports = router;