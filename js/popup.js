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
document.getElementById("apod").addEventListener("click", function(){
  shareOptions.className = shareOptions.className.replace(" w3-show", "");
});

//Sets image to today
var days = 0;
//Gets date from days from current date
function getYesterdaysDate() {
    var date = new Date()
    date.setTime(date.getTime() + (days * (24*60*60*1000)));  // date.setTime takes milliseconds, to turns the days into milliseconds as well
    
    // Timezone
    var localeOptions = {
      timeZone: "America/New_York"
    }

    // Gets years, months and days in seperate functions, and then concatenates the array to a single string with dashes between
    var dateString = [
      date.toLocaleDateString("en-US", {...localeOptions, year: "numeric"}),
      date.toLocaleDateString("en-US", {...localeOptions, month: "2-digit"}),
      date.toLocaleDateString("en-US", {...localeOptions, day: "2-digit"})
    ].join("-");
    
    return dateString;
}

function lastImage() {
  //Hide sharing options if Open
  shareOptions.className = shareOptions.className.replace(" w3-show", "");
  days = days - 1;
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
}
function nextImage() {
  //Hide sharing options if Open
  shareOptions.className = shareOptions.className.replace(" w3-show", "");
  days = days + 1;
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
}

//Deafult URL for today's picture
var url = 'https://api.nasa.gov/planetary/apod?api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';

//Request today's picture
loadAPOD(url);

//Patch for very odd bug
document.getElementById("controls").style.display = "none";
document.getElementById('back').style.display = "inline";
document.getElementById("controls").style.display = "inline";
document.getElementById('back').style.display = "none";
//End patch

//Gets previous picture
document.getElementById("backButton").addEventListener("click", lastImage);
//Gets next picture
document.getElementById("nextButton").addEventListener("click", nextImage);
//Custom date send button
document.getElementById("sendButton").addEventListener("click", function(){
  document.getElementById("controls").style.display = "none";
  document.getElementById('back').style.display = "inline";
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

//Opens links in popup in new tab
$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});
