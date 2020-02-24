const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('redirects', new Schema({
  email: {
    type: String,
    required: true
  },
  redirectid: {
    type: String,
    unique: true,
    required: true,
  },
  redirect: {
    type: String,
    required: true
  },
  customRedirect: {
    type: String,
    unique: true
  }
}))