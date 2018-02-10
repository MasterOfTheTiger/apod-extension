function loadAPOD(url) {
  //Shows loader
  $("#loader").css("display", "block");
  $("#apod").css("display", "none");
  $("#internet").css("display", "none");
  setTimeout(function(){document.getElementById('internet').style.display = "block"}, 5000);
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
  }
  });

}
//Deafult URL for today's picture
var url = 'https://api.nasa.gov/planetary/apod?api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
loadAPOD(url);
//Sets image to today
var days = 0;
//Gets date from days from current date
function getYesterdaysDate() {
    var date = new Date();
    date.setDate(date.getDate()+days);
    //Uses moment.js to change the format to a useable string
    date = moment(date).format('YYYYMMDD');
    //Splits and puts dashes in between for use in the API
    date = date.split('');
    date.splice(4, 0, "-");
    date.splice(7, 0, "-");
    return date.join("");
}
//Gets previous picture
document.getElementById("backButton").addEventListener("click", function(){
  days = days - 1;
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
});
//Gets next picture
document.getElementById("nextButton").addEventListener("click", function(){
  days = days + 1;
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
});
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
//This does nothing right now, eventually that will be the code for the favorite button
document.getElementById("star").addEventListener("click", function(){
  localStorage["favorite"] = getYesterdaysDate();
})
//Opens links in popup in new tab
$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});
