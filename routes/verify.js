var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', (req, res) => {
  res.sendStatus(404);
})

router.get('/:id', (req, res) => {
  User.updateOne({ token: req.params.id }, { $set: { verified: true }, $unset: { token: "" } }, (err, user) => {
    if (err) {
      res.json("There is some error");
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