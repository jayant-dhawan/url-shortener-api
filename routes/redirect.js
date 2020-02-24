const express = require('express');
const router = express.Router();
const requestip = require('request-ip');
const axios = require('axios');
const redirectClicks = require('../models/redirectClicks');
const redirects = require('../models/redirects');

/* Handle GET Request */
router.get('/', (req, res) => {
  res.sendStatus(404);
})

/* Handle Redirect Request */
router.get('/:redirectid', async (req, res) => {
  const redirectid = req.params.redirectid;
  const clientIp = '24.48.0.1'//requestip.getClientIp(req);
  var clientGEO = {};
  await getGEO(clientIp)
    .then(response => {
      clientGEO = response;
    });
  redirects.findOne({ redirectid }, (error, link) => {
    if (error) {
      res.send(error);
    }
    if (link) {
      redirectClicks.create({
        redirectid: redirectid,
        ip: clientIp,
        country: clientGEO.country,
        countryCode: clientGEO.countryCode,
        region: clientGEO.region,
        regionName: clientGEO.regionName,
        city: clientGEO.city,
        zip: clientGEO.zip,
        lat: clientGEO.lat,
        lon: clientGEO.lon,
        timezone: clientGEO.timezone,
        isp: clientGEO.isp
      })
        .catch(error => {
          res.send(error);
        })
      res.redirect(link.redirect);
    }
    else if (!link) {
      redirects.findOne({ customRedirect: redirectid }, (error, link) => {
        if (error) {
          res.send(error);
        }
        else if (link) {
          redirectClicks.create({
            redirectid: redirectid,
            ip: clientIp,
            country: clientGEO.country,
            countryCode: clientGEO.countryCode,
            region: clientGEO.region,
            regionName: clientGEO.regionName,
            city: clientGEO.city,
            zip: clientGEO.zip,
            lat: clientGEO.lat,
            lon: clientGEO.lon,
            timezone: clientGEO.timezone,
            isp: clientGEO.isp
          })
            .catch(error => {
              res.send(error);
            })
          res.redirect(link.redirect);
        } else {
          res.json("no redirect found");
        }
      })
    } else {
      res.json("no redirect found");
    }
  });
});

async function getGEO(clientIp) {
  const endpoint = `http://ip-api.com/json/${clientIp}?fields=58367`;
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    return error;
  }
}

module.exports = router