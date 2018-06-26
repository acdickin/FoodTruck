
var request = require('request');
var _= require('underscore');
var bodyParser = require('body-parser');
var express=require('express');
var app =  express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//get day and time
var day = getDayOfTheWeek();
var time = getCurrentHour();
var url = "http://data.sfgov.org/resource/bbb8-hzi6.json?dayofweekstr="+day

request(url ,function (error, response, body) {
  var unsorted = JSON.parse(body);

  var filtered = unsorted.filter(function(truck){
    var start = truck.start24;
    start = start.substring(0,2);
    return parseInt(start)>time;
  })

  var sorted= filtered.sort(compare);

  process.stdout.write("If you would like to load more hit enter");
  process.stdout.write("If you wish to escape press controll+c");
  process.stdin.once("data", function (data) {
       callback(data.toString().trim());
   });

})


//sorts data alphabetically
function compare(a,b){
  var nameA = a.applicant.toUpperCase(); // ignore upper and lowercase
  var nameB = b.applicant.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
  // applicant must be equal
  return 0
}

function getDayOfTheWeek(){
  var date =new Date();
  var week=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  var d = date.getDay();
  return week[d];
}
function getCurrentHour(){
  var date =new Date();
  return date.getHours();
}

// to run locally, first install node and npm. then:
// $ npm install request && node foodtruck.js
