var request = require('request');
var columnify = require('columnify');
var	query = require('cli-interact').getYesNo;

//get day and time
var day = getDayOfTheWeek();
var time = getCurrentHour();
var url = "http://data.sfgov.org/resource/bbb8-hzi6.json?dayofweekstr="+day


// for testing
// var sorted =require("./foodtruckData");
// printList(sorted);

//Request data and then print results
request(url ,function (error, response, body) {
  var unsorted = JSON.parse(body);

  var filtered = unsorted.filter(function(truck){
    var start = truck.start24;
    start = start.substring(0,2);
    return parseInt(start)>time;
  })

  var sorted= filtered.sort(compare);
  printList(sorted);
})

//prints the lists
function printList(sorted){
  var arr=[];
  var name, location;
  var max=sorted.length-1;

  for (var i=0; i<=max; i++){
    name=sorted[i].applicant;
    location=sorted[i].location;
    arr.push ({name,location});

    if((!(i % 10) && i>1)){
      console.log("")
      console.log(columnify(arr));
      console.log("");

      var answer = query('Do you Wish to see more ');

      if (!answer) {break;}

      arr=[];
    }
    else if(i==max){
      console.log(columnify(arr));
    }
  }
}

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
