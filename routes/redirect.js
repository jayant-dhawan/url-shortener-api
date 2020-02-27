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

/* Handle GET request for empty Redirect  */
router.get('/', (req, res) => {
  res.json({ status: "empty redirect" });
})

/* Handle GET request for Redirect  */
router.get('/:redirectid', async (req, res) => {
  const redirectid = req.params.redirectid;
  const clientIp = requestip.getClientIp(req);
  var clientGEO = {};

  //get Geographic details of the user using his IP address from http://ip-api.com
  await getGEO(clientIp)
    .then(response => {
      clientGEO = response;
    });

  //find the original url using the redirectid
  await redirects.findOne({ redirectid }, (error, link) => {
    if (error) {
      res.json({
        error: error.status
      });
    }
    if (link) { ////if link is found click details are addded to database
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
          res.json({
            error: error.status
          });
        })
      res.redirect(link.redirect); // After adding click details to database user is redirected to original link
    }
    else if (!link) { //if no link is found then the URL may be a custom URL so checking database for custom URL
      redirects.findOne({ customRedirect: redirectid }, (error, link) => {
        if (error) {
          res.json({
            error: error.status
          });
        }
        else if (link) { //if link is found click details are addded to database
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
              res.json({
                error: error.status
              });
            })
          res.redirect(link.redirect); // After adding click details to database user is redirected to original link
        } else {
          res.json({ status: "no redirect found" });
        }
      })
    } else {
      res.json({ status: "no redirect found" });
    }
  });
});

//Function to get the Geographic location from IP address using http://ip-api.com 
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