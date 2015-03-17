var numAnime = 0;

var show_list = [];
var images = [];
var descrips = [];

//For storage and user show list
var storage = chrome.storage.sync;
var theshow = 'shows';
var usershows = {};

window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));


$(function() {
    $( "#shows" ).autocomplete({
      source: show_list
    });
  });
$(document).ready(function() { 
  console.log("ready!");
  getAllAnimeYears();
});
function createTable(){
  var table = document.getElementById("show_grid");
  for(var cell = 0; cell < 10; cell+=2){
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    row.className = "row";
    var temp = "http://media1.popsugar-assets.com/files/2014/02/18/159/n/28443503/5945b74bba9e1117_shutterstock_105361820.jpg.xxxlarge/i/Calories-Sushi.jpg";
    cell1.innerHTML = "<div class='box'><div class='innerbox'><div class='colRoll'><div class='roll'><a href='http://en.wikipedia.org/wiki/" + show_list[cell] + "'>" + show_list[cell] + "</a><br><img id = 'showid_" + cell + "' src ='" + temp + "' class='img-circle sushi'></img></div></div></div></div>";
    cell2.innerHTML = "<div class='box'><div class='innerbox'><div class='colRoll'><div class='roll'><a href='http://en.wikipedia.org/wiki/" + show_list[cell + 1] + "'>" + show_list[cell + 1] + "</a><br><img id = 'showid_" + cell + "' src ='" + temp + "' class='img-circle sushi'></img></div></div></div></div>";
  }
}
function getAllAnimeYears(){
  reloadTwitterButton("Hamtaro");

  for(var i = 2014; i <= 2015; i++){
    loadWikiData(i);
  }
  console.log("Done loading wiki shows.");
}
function loadShowData(this_num)
{
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    xmlhttp.onreadystatechange=function()
    {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
            var wiki_page = xmlhttp.responseText;
            var wiki_infobox = $(".infobox", wiki_page);
            images[this_num] = "http:" + $("img", wiki_infobox).attr('src');
            var wiki_descrip = $("#mw-content-text", wiki_page);
            descrips[this_num] = $("p", wiki_descrip).first();
            console.log("trying: http://en.wikipedia.org/wiki/" + show_list[this_num]);
            console.log("showid_" + this_num);
            console.log("stored src: " + $("img", wiki_infobox).attr('src'));
            document.getElementById("showid_" + this_num).src = images[this_num];
            console.log("new src: " + document.getElementById("showid_" + this_num).src);
      }
      
    }
    xmlhttp.open("GET","http://en.wikipedia.org/wiki/" + show_list[this_num],true);
    xmlhttp.send();
}
function loadWikiData(year)
{
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    xmlhttp.onreadystatechange=function()
    {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
            var wiki_list = xmlhttp.responseText;
            var wiki_html = $("#mw-pages", wiki_list);
            $("a", wiki_html).each(function(){
              if($(this).attr("title") != "undefined" && $(this).attr("title").length != 0 && $(this).attr("title") != "Wikipedia:FAQ/Categories"){
                show_list[numAnime] = $(this).attr("title");
                loadShowData(numAnime);
                numAnime++;
              }
            });
            createTable();
                
      }
      
    }
    xmlhttp.open("GET","http://en.wikipedia.org/wiki/Category:" + year +"_anime_television_series",true);
    xmlhttp.send();
}
function reloadTwitterButton(show){

  document.getElementById("twitterContainer").innerHTML = "";

  var link = document.createElement('a');
  link.setAttribute('href', 'https://twitter.com/int?screen_name=wondachue');
  link.setAttribute('class', 'twitter-mention-button');
  link.setAttribute("data-text" , "Hey there tomodachi, " + show + " is airing on: " );
  link.setAttribute("data-size" ,"large");
  //link.setAttribute("data-via" ,"tomodachibox") ;
  link.setAttribute("data-url" ,"http://en.wikipedia.org/wiki/" + show);
  document.getElementById("twitterContainer").appendChild(link) ;
  $.getScript('https://platform.twitter.com/widgets.js', function(){
    twttr.widgets.load();
  });
}
//EventListener that listens once the extension loads
document.addEventListener('DOMContentLoaded', function() {
    var addToBox = document.getElementById('addToBox');
    
    addToBox.addEventListener('click', function() {
        var show = document.getElementById('shows').value;

        //reload twitter button with new show
        reloadTwitterButton(show);


        //This is where the new page will be loaded from!
        document.getElementById('shows').value = "";

        //checks on input here, making sure it is actually a show
        //and then adding it to the user's list
        var isShow = false;
        for(var i = 0; i < show_list.length; i++){
          if(show == show_list[i]){
            isShow = true;
            break;
          }
        }

        if(isShow){
          
                   
          storage.get(function(usershows){
            if(typeof(usershows["shows"]) !== 'undefined' && usershows["shows"] instanceof Array) {
              usershows["shows"].push(show);
            }
            else{
              usershows["shows"] = [show];
            }
            chrome.storage.sync.set(usershows);
          });
          

          storage.get(theshow,function(result){
            console.log("The user's current " + theshow + " list : ",result);
            
            var list = '';
            for (var title in result) {
              list += title + ': ' + result[title]+'; ';
            }
            console.log("The current user " + list);

            document.getElementById('bg').innerHTML = "<b>The Personal List Page here?<br><br>This is the show that was input by the user: " + show + "<br><br>The previous user " + list + "</b>";

          })



          
        }
        else{
          document.getElementById('bg').innerHTML = "<b>The Personal List Page here?<br>Silly you! That wasn't a show >:T</b>";
        }



        
    });

  notifyFriends.addEventListener('click', function() {
        console.log("The user wants to notify friends of release dates");

        document.getElementById('bg').innerHTML = "<b>Notify Friends Page Here</b>";
                
    });

});

