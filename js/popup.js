function loadAPOD(url) {
  //Shows loader
  $("#loader").css("display", "block");
  $("#apod").css("display", "none");
  $("#internet").css("display", "none");
  $("#loadingbox").css("display", "initial");
  var internet = setTimeout(function(){document.getElementById('internet').style.display = "block"}, 5000);
  $.ajax({
    url: url,
    success: function(result){
    if("copyright" in result) {
      $("#copyright").text("Image Credits: " + result.copyright);
    }
    else {
      $("#copyright").text("Image Credits: " + "Public Domain");
    }
    if(result.media_type == "video") {
      $("#apod_img_id").css("display", "none");
      $("#apod_vid_id").css("display", "block");
      $("#apod_vid_id").attr("src", result.url);
    }
    else {
      $("#apod_vid_id").css("display", "none");
      $("#apod_img_id").css("display", "block");
      $("#apod_img_id").attr("src", result.url);
      $("#apod_img_id").attr("alt", result.url);
      $("#apod_img_link").attr("href", result.url);
    }
    //Updates share buttons
    var apodDate = result.date.split("-");
    apodDate = apodDate.join("").split("");
    apodDate.shift();
    apodDate.shift();
    apodDate = apodDate.join("");
    //Email
    var emailText = "mailto:?subject=" + result.title + " - Astronomy Picture of the Day" + "&body=" + result.explanation + "%0ALink to picture:%20" + result.url;
    $("#mailImage").attr("href", emailText);
    //Twitter
    var tweetText = "https://twitter.com/intent/tweet?text=Check out this astronomy picture of the day:%20" + "http%3A%2F%2Fapod.nasa.gov%2Fapod%2Fap" + apodDate + ".html";
    $("#tweetImage").attr("href", tweetText);
    //Facebook
    var fbText = "https://www.facebook.com/share.php?u=http%3A%2F%2Fapod.nasa.gov%2Fapod%2Fap" + apodDate + ".html";
    $("#facebookImage").attr("href", fbText);

    $("#apod_explaination").text(result.explanation);
    $("#apod_title").text(result.title);
    /* Text date no longer used
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var textDate = result.date.split("-");
    textDate[1] = " " + months[Number(textDate[1])-1] + " ";
    //$("#date").text(textDate.join(""));
    */
    //Sets the date in the input box to the APOD date being viewed
    document.getElementById('date').value = result.date;
    //Hides next button when viewing today's picture
    if (days == 0) {
      document.getElementById("nextButton").style.display = "none";
    } else {
      document.getElementById("nextButton").style.display = "inline";
    }
    //Hides loader and displays image and information
    $("#apod").css("display", "block");
    $("#loader").css("display", "none");
    $("#loadingbox").css("display", "none");
    clearTimeout(internet);
  }
  });

}

var shareOptions = document.getElementById("shareOptions");
function showSharing() {
    if (shareOptions.className.indexOf("w3-show") == -1) {
        shareOptions.className += " w3-show";
    } else {
        shareOptions.className = shareOptions.className.replace(" w3-show", "");
    }
}
document.getElementById("share").addEventListener("click", showSharing);

//Deafult URL for today's picture
var url = 'https://api.nasa.gov/planetary/apod?api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
loadAPOD(url);
//Sets image to today
var days = 0;
//Gets date from days from current date
function getYesterdaysDate() {
    //Gets yesterday's date as object
    var date = moment().add(days, 'days');
    //Changes time zone to EST
    date=date.tz('America/New_York');
    //Changes the format to a useable string
    date = moment(date).format('YYYYMMDD');
    //Splits and puts dashes in between for use in the API
    date = date.split('');
    date.splice(4, 0, "-");
    date.splice(7, 0, "-");
    console.log(date.join(""));
    return date.join("");
}
//Gets previous picture
document.getElementById("backButton").addEventListener("click", function(){
  //Hide sharing options if Open
  shareOptions.className = shareOptions.className.replace(" w3-show", "");
  days = days - 1;
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
});
//Gets next picture
document.getElementById("nextButton").addEventListener("click", function(){
  //Hide sharing options if Open
  shareOptions.className = shareOptions.className.replace(" w3-show", "");
  days = days + 1;
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
});
//Custom date send button
document.getElementById("sendButton").addEventListener("click", function(){
  document.getElementById("controls").style.display = "none";
  document.getElementById('back').style.display = "inline";
  //Hide sharing options if Open
  $("#sharing").css("display", "none");
  //Gets date in input box
  var datetoo = document.getElementById("date").value;
  //Requests image for the date
  url = 'https://api.nasa.gov/planetary/apod?date=' + datetoo + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
});
//Feature to return to previous picture after typing in a manual one
document.getElementById("back").addEventListener("click", function(){
  //This shows the normal controls and hides the back button
  document.getElementById("controls").style.display = "inline";
  document.getElementById('back').style.display = "none";
  //Requests last seen image
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
});
//This does nothing right now, eventually that will be the code for the favorite button
/*document.getElementById("star").addEventListener("click", function(){
  localStorage["favorite"] = getYesterdaysDate();
})*/

//Opens links in popup in new tab
$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});
