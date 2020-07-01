//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({extended: true})); // bodyParser parse the data thats urlencoded and lets me use the data from it
app.use(express.static("public")); //add name of folder to keep as static. Stores images and css styling

//--GET REQUEST--//

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

//---POST REQUEST--//

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);//Turned my JSON data i pulled into a string.

  const url = "https://us10.api.mailchimp.com/3.0/lists/9c57d067d"; // Make sure to add list id(keep at bottom of js page) at the end because we could have multiple lists.
  //--Make sure to replace usX with the APIKey last digit numbers on the end of us. ex: us10---////

  const options = {
    method: 'POST',
    auth: "freddy1:783cd58b26561f893e061f3175399048-us10"
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/succes.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
//To write the requested data. make sure to use request to not get it confused with req.
request.write(jsonData);
request.end();
});
//redirects me back to home page for try again button
app.post('/failure', function(req,res) {
  res.redirect("/")
})

app.listen(3000, function() {
  console.log("Server is running on Port 3000")
});
