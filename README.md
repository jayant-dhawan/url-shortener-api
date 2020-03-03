# URL Shortener API

A url shortener API made with NodeJS, ExpressJS, Passport and MongoDB


## Endpoints:

### Authentication:

`POST /login`

Example request body:
```JSON
{
  "email": "jake@jake.jake",
  "password": "jakejake"
}
```

No authentication required, returns a [UserLogin](#userlogin)

Required fields: `email`, `password`


### Registration:

`POST /register`

Example request body:
```JSON
{
  "firstname": "Jacob",
  "lastname": "Smith",
  "email": "jake@jake.jake",
  "password": "jakejake"
}
```

No authentication required, returns a [UserRegister](#userregister)

Required fields: `email`, `firstname`, `password`

### Verify

`GET /verify/:token?email=<email>`

No authentication required, returns a [UserVerify](#userverify)

Required feilds: `token`, `email`

### Shorten

`POST /shorten`

Example request body:
```JSON
{
    "url": "http://google.com"
}
```

Authentication required, returns a [ShortUrl](#shorturl)

Required feilds: `url`

### Redirect

`GET /r/:redirectid`

No Authentication Required, redirect to mapped big url

Required feilds: `redirectid`

### Get Redirects

`GET /redirects`

Authentication Required, returns a [Redirects](#redirects)

### Get Click Counts

`GET /click/count/:redirectid`

Authentication Required, return a [ClickCount](#clickcount)

Required feilds: `redirectid`

### Get Click Details

`GET /click/details/:redirectid`

Authentication Required, return a [ClickDetails](#clickdetails)

Required feilds: `redirectid`

## JSON Objects returned by API:

### UserLogin

```JSON
{
  "email": "jake@jake.jake",
  "token": "jwt.token.here",
  "firstname": "Jacob",
  "lastname": "Smith",
  "verified": true
}
```

### UserRegister

```JSON
{
  "message": "Signup Successfull",
  "email": "jake@jake.jake",
  "firstname": "Jacob",
  "lastname": "Smith",
  "verified": false
}
```

### UserVerify

```JSON
{
  "status": "verified"
}
```

### ShortUrl

```JSON
{
  "shortUrl": "a short url"
}
```

### Redirects

```JSON
{
  "status": "successfull",
  "redirects": [
    {
      "email": "jakejake@jakecom",
      "redirect": "http://google.com",
      "redirectid": "yJbv_Pyt",
      "customRedirect": "google"
    }
  ]
}
```

### ClickCount

```JSON
{
  "status": "successfull",
  "count": 0
}
```

### ClickDetails

```JSON
{
  "status": "successfull",
  "response": [
    {
      "_id": "5e578f694c951b0fc08a3d3f",
      "redirectid": "yJbv_Pyt",
      "ip": "24.48.0.1",
      "country": "Canada",
      "countryCode": "CA",
      "region": "QC",
      "regionName": "Quebec",
      "city": "Montreal",
      "zip": "H1S",
      "lat": 45.5808,
      "lon": -73.5825,
      "timezone": "America/Toronto",
      "isp": "Le Groupe Videotron Ltee",
      "__v": 0
    }
  ]
}
```


## Configuration

### Sample .env file to configure API

```
# Base URL
BASEURL = "Baseurl of backend"

#SMTP Settings
EMAIL = "Your Email"
PASSWORD = "Password for email"
PORTSMTP = Port for SMTP Server
HOST = "Host for SMTP Server"

#MongoDB Link
MONGODBURL = "Link to MongoDB Databse"

#JWT Secret Key
JWTSECRET = "Your JWT Secret Key for authentication"
```


