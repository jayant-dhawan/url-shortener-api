var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', (req, res) => {
  res.render('error', {
    message: "Not Found", error: {
      status: "404",
      stack: ""
    }
  });
})

router.get('/:id', (req, res) => {
  User.updateOne({ token: req.params.id }, { $set: { verified: true }, $unset: { token: "" } }, (err, user) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else if (user.nModified > 0) {
      console.log(user);
      res.status(200).json("verified");
    } else {
      res.json("not verified");
    }
  })
});

module.exports = router;