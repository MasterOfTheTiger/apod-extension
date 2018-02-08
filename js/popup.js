function loadAPOD(url) {
  $("#loader").css("display", "block");
  $("#apod").css("display", "none");
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
    //$("#reqObject").text(url);
    //$("#returnObject").text(JSON.stringify(result, null, 4));
    $("#apod_explaination").text(result.explanation);
    $("#apod_title").text(result.title);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var textDate = result.date.split("-");
    textDate[1] = " " + months[Number(textDate[1])-1] + " ";
    //$("#date").text(textDate.join(""));
    document.getElementById('date').value = result.date;
    if (days == 0) {
      document.getElementById("nextButton").style.display = "none";
    } else {
      document.getElementById("nextButton").style.display = "inline";
    }
    $("#apod").css("display", "block");
    $("#loader").css("display", "none");
  }
  });

}

var url = 'https://api.nasa.gov/planetary/apod?api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
loadAPOD(url);

var days = 0;

function getYesterdaysDate() {
    var date = new Date();
    date.setDate(date.getDate()+days);
    date = moment(date).format('YYYYMMDD');
    date = date.split('');
    console.log(date);
    date.splice(4, 0, "-");
    date.splice(7, 0, "-");
    return date.join("");
    //return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
    //return date.getFullYear() + '-' + (date.getMonth()+1) + '/' + date.getDate();
}

document.getElementById("backButton").addEventListener("click", function(){
  days = days - 1;
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
});
document.getElementById("nextButton").addEventListener("click", function(){
  days = days + 1;
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
});
document.getElementById("sendButton").addEventListener("click", function(){
  document.getElementById("controls").style.display = "none";
  document.getElementById('back').style.display = "inline";
  var datetoo = document.getElementById("date").value;
  url = 'https://api.nasa.gov/planetary/apod?date=' + datetoo + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
});
document.getElementById("back").addEventListener("click", function(){
  document.getElementById("controls").style.display = "inline";
  document.getElementById('back').style.display = "none";
  url = 'https://api.nasa.gov/planetary/apod?date=' + getYesterdaysDate() + '&api_key=f88nlByrAKllCaklW1AtfDuqiAUKAinSni0EcjhW';
  loadAPOD(url);
});

$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});
