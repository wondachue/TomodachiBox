var show_list = [
      "Hamtaro",
      "Pokemon",
      "Dragon Ball"
    ];
$(function() {
    $( "#shows" ).autocomplete({
      source: show_list
    });
  });
$(document).ready(function() { 
  console.log("ready!");
  loadXMLDoc();
});
function loadXMLDoc()
{
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    xmlhttp.onreadystatechange=function()
    {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
            var wiki_list = xmlhttp.responseText;
            var wiki_html = $(".mw-category", wiki_list);
            count = 0; 
            $("a", wiki_html).each(function(){
              show_list[count] = $(this).attr("title");
              count++;
            });
      }
    }
    xmlhttp.open("GET","http://en.wikipedia.org/wiki/Category:2015_anime_television_series",true);
    xmlhttp.send();
}
/*
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('popup.html', {
    'bounds': {
      'width': 800,
      'height': 800
    }
  });
});*/