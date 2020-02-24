const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('redirectClicks', new Schema({
    redirectid: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true,
    },
    country: String,
    countryCode: String,
    region: String,
    regionName: String,
    city: String,
    zip: String,
    lat: Number,
    lon: Number,
    timezone: String,
    isp: String
}))