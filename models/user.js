const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('users', new Schema({
    email: {
        type : String,
        required : true,
        unique : true
      },
    passwordHash: {
        type : String,
        required : true,
      },
    token: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      required: true
    }
}))