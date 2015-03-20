var numAnime = 0;

var show_list = [];
var images = [];
var descrips = [];

//For storage and user show list
var storage = chrome.storage.sync;
var theshow = 'shows';
var usershows = {};

window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));

/*getFB = function(){ // this could be done faster with the livequery() plugin for jquery

    /*elt = document.createElement('iframe');
    elt.id = 'facebook_load_frame';
    elt.src = 'https://cise.ufl.edu/~mdwyer/index.html';
    document.getElementById('facebook_handler').appendChild(elt);
    };*/
    // Message passing API from David Walsh at http://davidwalsh.name/window-iframe
    // Create IE + others compatible event handler
    //var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    //var eventer = window[eventMethod];
    //var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    // Listen to message from child window
    //eventer(messageEvent,function(e) {
      //console.log('called');
     //console.log("Connection status: "+e.data.connectStatus+"; UserID: "+e.data.userID+"; AccessToken: "+e.data.accessToken);
     //This is the data from the Facebook SDK

//},false);*/


$(function() {
    $( "#shows" ).autocomplete({
      source: show_list
    });
  });

$(document).ready(function() { 
  $('<iframe />', {
       src: 'https://cise.ufl.edu/~mdwyer/index.html',
       id:  'facebook_load_frame',
       load:function(){
          var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
          var eventer = window[eventMethod];
          var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
          eventer(messageEvent,function(e) {
            console.log("Connection status: "+e.data.connectStatus+"; UserID: "+e.data.userID+"; AccessToken: "+e.data.accessToken);
          });
       }
  }).appendTo('#facebook_handler');
  
  getAllAnimeYears();

  $('button.titleBtn').click(function(){
    makeShowPage("a click happened");
  });
});

function createTable(page){
  var table = document.getElementById("show_grid");

  if(page == "home"){    
    table.innerHTML = "";
    
    storage.get(theshow,function(result){ 
      
      if(result.shows == null){
        table.innerHTML = "Add shows to your list with the search bar above!";
      }

      var size = result.shows.length;

      for(var cell = 0; cell < size; cell +=2){
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        row.className = "row";
    
        var temp = "http://media1.popsugar-assets.com/files/2014/02/18/159/n/28443503/5945b74bba9e1117_shutterstock_105361820.jpg.xxxlarge/i/Calories-Sushi.jpg";
        
        cell1.innerHTML = ($("<div>").addClass("box").append(
          $("<div>").addClass("innerbox").append(
            $("<div>").addClass("colRoll").append(
              $("<div>").addClass("roll").html(
                  "<a class='titlelink' id = '" + result.shows[cell] + "' href='http://en.wikipedia.org/wiki/" + result.shows[cell] + "'>" + 
                  result.shows[cell] + "</a><br><img id = 'showid_" + (cell) + "' src ='" + 
                  temp + "' class='img-circle sushi'></img>"))))).html();
        
        //leaving a trailing empty box if the num of user shows is odd, or filling it as needed~
        //--LEFT UNDONE-- putting the trailing box at the bottom?
        if(size % 2 != 0 && cell == size-1){
          cell2.innerHTML = ($("<div>").addClass("box").append(
            $("<div>").addClass("innerbox").append(
              $("<div>").addClass("colRoll").append(
                $("<div>").addClass("roll").text(""))))).html(); 
        }
        else{

          cell2.innerHTML = ($("<div>").addClass("box").append(
            $("<div>").addClass("innerbox").append(
              $("<div>").addClass("colRoll").append(
                $("<div>").addClass("roll").html("<a href='http://en.wikipedia.org/wiki/" + result.shows[cell+1] + "'>" + result.shows[cell+1] + "</a><br><img id = 'showid_" + (cell+1) + "' src ='" + temp + "' class='img-circle sushi'></img>"))))).html();
        }

      }
        addLinkOnClick(result.shows); 
    });
  }
  else if(page == "list"){

    table.innerHTML = "";
    
    storage.get(theshow,function(result){ 
      var size = result.shows.length;
      for(var cell = 0; cell < size; cell +=1){
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        row.className = "row";

        cell1.innerHTML = ($("<div>").addClass("box").append(
        $("<div>").addClass("innerbox").append(
          $("<div>").addClass("colRoll").append(
            $("<div>").addClass("roll").append(
              $("<a>").attr("href","http://en.wikipedia.org/wiki/" + result.shows[cell]).text(result.shows[cell])))))).html();

        

        cell2.innerHTML = ($("<div>").addClass("box").append(
        $("<div>").addClass("innerbox").append(
          $("<div>").addClass("colRoll").append(
            $("<div>").addClass("roll").text(
              "Something dependent upon " + result.shows[cell] + " goes here..."))))).html();

        }
    });


  }
  else if($page == "notify"){

  }
  else{
    console.log("something horrible happened to get here @_@");
  }

}


function addLinkOnClick(showArray){
  var links = $('.titlelink');
  console.log(links);
  for(var i = 0; i < links.length; i++){
    var link = links[i];
    link.onclick = function(){
       console.log("the id should be " + link.id);
    }
  }
}


function getAllAnimeYears(){
  reloadTwitterButton("Hamtaro");

  for(var i = 2015; i <= 2015; i++){
    loadWikiData(i);
  }
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
            try{
              document.getElementById("showid_" + this_num).src = images[this_num];
            }
            catch(err){
              //TypeError: Cannot set property 'src' of null
            }
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
            createTable("home");
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

function makeShowPage(showname){
   var table = document.getElementById("show_grid");    
   table.innerHTML = "Request to view " + showname + " page, beginning creation...";

}

//EventListener that listens once the extension loads
document.addEventListener('DOMContentLoaded', function() {
    var addToBox = document.getElementById('addToBox');

    addToBox.addEventListener('click', function() {
        var show = document.getElementById('shows').value;

        //reload twitter button with new show
        reloadTwitterButton(show);

        //This is where the new page will be loaded from!----------------------
        document.getElementById('shows').value = "";

        //makes sure it is actually a show and then adds it to the user's list
        var isShow = false;
        for(var i = 0; i < show_list.length; i++){
          if(show == show_list[i]){
            isShow = true;
            break;
          }
        }
        
        //last check should make it unique?
        storage.get(function(usershows){

        if(isShow && $.inArray(show,usershows["shows"]) == -1){     
          
                    
            if(typeof(usershows["shows"]) !== 'undefined' && usershows["shows"] instanceof Array) {
              usershows["shows"].push(show);
            }
            else{
              usershows["shows"] = [show];
            }
            chrome.storage.sync.set(usershows);
                                
            var list = '';
            for (var title in usershows) {
              list += title + ': ' + usershows[title]+'; ';
            }
            console.log("The current user " + list);
            
            createTable("home");
          
          
        }
        else{
          console.log("Get here by putting in a show already on your list or something that isn't a show! We need to notify the user somehow.");
          //document.getElementById('show_grid').innerHTML = "<b>The Personal List Page here?<br>Silly you! That wasn't a show >:T</b><br><br>The previous user inputed " + list + "</b>";
        }
        });
        
    });

    notifyFriends.addEventListener('click', function() {
          console.log("The user wants to notify friends of release dates");

          document.getElementById('bg').innerHTML = "<b>Notify Friends Page Here</b>";
                  
    });

});

