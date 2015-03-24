var numAnime = 0;

//Handling of the show list
var show_list = [];
var images = [];
var descrips = [];
var fb_shows_user = [];
var fb_shows_friends = [];

//For storage and user show list
var storage = chrome.storage.local;

var usershows = {};

var dateToStore = -1;
var showsToStore = {};


//Hanlding of the Social Media
var fb_connectStatus = "nope";
var fb_accessToken = "nope";
var fb_userID = "nope";

window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));

$(function() {
  storage.get(function(result){

    if(result.showList != undefined){
      $( "#shows" ).autocomplete({
        source: result.showList
      });
    }
    else{
      $( "#shows" ).autocomplete({
        source: show_list
      });  
    }
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
});

function getFBInfo(){
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    xmlhttp.onreadystatechange=function()
    {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
            var fbjson = xmlhttp.responseText;
            var data_fb = JSON.parse( fbjson );
            //console.log(fbjson);
            for(thing in data_fb.friends){
              console.log(thing);
              if(thing === "data"){
                for(num in data_fb.friends.data){
                  for(thing2 in data_fb.friends.data[num].television){
                    console.log(thing2);
                    if(thing2 === "data"){
                      for(show in data_fb.friends.data[num].television.data){
                          fb_shows_friends.push(data_fb.friends.data[num].television.data[show].name); 
                      }
                    }
                  }
                }
              }
            }
            for(elem in data_fb.television.data){
                fb_shows_user.push(data_fb.television.data[elem].name);
            }
      }
      
    }
    xmlhttp.open("GET","https://graph.facebook.com/v2.2/me?access_token=" + fb_accessToken +"&fields=id,name,friends{television},television",true);
    xmlhttp.send();
}

function listener(event){
  fb_connectStatus = event.data.connectStatus;
  fb_accessToken = event.data.accessToken;
  fb_userID = event.data.userID;
  console.log("connect: " + event.data.connectStatus + " accessToken:" + event.data.accessToken + " userID: " + event.data.userID);
  if(event.data.connectStatus == "connected"){
    getFBInfo();
  }
}
if (window.addEventListener){
  addEventListener("message", listener, false);
} else {
  attachEvent("onmessage", listener);
}


function createTable(page){
  var bg = document.getElementById('bg');
  bg.innerHTML = "";  

  $('<table id="show_grid">').appendTo('#bg');

  var table = document.getElementById("show_grid");

  if(page == "home"){    
    table.innerHTML = "";
    
    storage.get('shows',function(result){ 
      
      if(result.shows == null || result.shows == undefined){
        table.innerHTML = "Add shows to your list with the search bar above!<br><br>Important Notes:<br>The inital load requires an internet connection to function properly, and there might be some lag on this initial opening depending on your internet connection speed. We apologize for the trouble :(";
      }
      else{
        var size = result.shows.length;

        for(var cell = 0; cell < size; cell +=2){
          var row = table.insertRow(0);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          row.className = "row";
      
          var temp = "http://media1.popsugar-assets.com/files/2014/02/18/159/n/28443503/5945b74bba9e1117_shutterstock_105361820.jpg.xxxlarge/i/Calories-Sushi.jpg";
          
          var showID = -1;
          if(result.showList != null || result.showList != undefined){
            var showID = $.inArray(result.shows[cell],result.showList);
          }

          console.log("A found show id was " + showID);
          cell1.innerHTML = ($("<div>").addClass("box").append(
            $("<div>").addClass("innerbox").append(
              $("<div>").addClass("colRoll").append(
                $("<div>").addClass("roll").html(
                    "<a class='titlelink' id = '" + result.shows[cell] + "' href='http://en.wikipedia.org/wiki/" + result.shows[cell] + "'>" + 
                    result.shows[cell] + "</a><br><img id = 'showid_" + showID + "' src ='" + 
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
            var showID = -1;
            if(result.showList != null || result.showList !=undefined){
              showID = $.inArray(result.shows[cell+1],result.showList);
            }

            cell2.innerHTML = ($("<div>").addClass("box").append(
              $("<div>").addClass("innerbox").append(
                $("<div>").addClass("colRoll").append(
                  $("<div>").addClass("roll").html("<a href='http://en.wikipedia.org/wiki/" + result.shows[cell+1] + "'>" + result.shows[cell+1] + "</a><br><img id = 'showid_" + showID + "' src ='" + temp + "' class='img-circle sushi'></img>"))))).html();
          }

        }
      }
        addLinkOnClick(result.shows); 
        //console.log("Attempting to store list for the first time...");
        storeListPlease();

        //console.log("Done with creation of home page....");

    });
  }
  else{
    //console.log("something horrible happened to get here @_@");
  }

}

function addLinkOnClick(showArray){
  var links = $('.titlelink');
  for(var i = 0; i < links.length; i++){
    var link = links[i];
    link.onclick = function(){
       //console.log("The id of the clicked link should be: " + this.id);
       makeShowPage(this.id);
    }
  }

  //Just making sure the show list is stored as soon as possible
  storeListPlease();
}

function makeShowPage(showname){

  storage.get( function(result){
  var showID = -1;
  if(result.showList != null || result.showList != undefined){
    showID = $.inArray(showname,result.showList);
  }

  var space = document.getElementById("bg");
  space.innerHTML = "";

  ($("<h3>").addClass("spTitle").text("Anime Title: " + showname)).appendTo('#bg');
  
  //Show page content
  ($('<table>').attr("id","spTble")).appendTo('#bg');

  var tbl = document.getElementById("spTble");
  var row0 = tbl.insertRow(0);
  var cell0a = row0.insertCell(0);
  var cell0b = row0.insertCell(1);

  cell0a.innerHTML = ($('<div id="btn1">').addClass("spBtn").append(
    $("<button id='spAdd'>").html('<span class="glyphicon glyphicon-plus" style="vertical-align:middle"> </span> to Box'))).html();
  cell0b.innerHTML = ($('<div id="btn2">').addClass("spBtn").append(
    $("<button id='spRemove'>").html('<span class="glyphicon glyphicon-minus" style="vertical-align:middle"> </span> from Box'))).html();
  

  var row1 = tbl.insertRow(1);
  var cell1a = row1.insertCell(0);
  var cell1b = row1.insertCell(1);

  cell1a.innerHTML = ($("<div>").addClass("spImg").append(
    $('<img>').addClass("spImgT").attr('src',result.imageList[showID]))).html();
  cell1b.innerHTML = ($("<div>").addClass("spDesc").text("descripList should populate here")).html();  

  var row2 = tbl.insertRow(2);
  var cell2a = row2.insertCell(0);
  var cell2b = row2.insertCell(1);  

  cell2a.innerHTML = ($("<div>").addClass("spRelInfo").text("Release date info here")).html();
  cell2b.innerHTML = ($("<div>").addClass("spSocial").text("Social media connection aspects here?")).html();

  });
}

function storeListPlease(){
  //should only store if there is stuff in the list?
    if(show_list != undefined && show_list.length != 0){
      storage.set({"showList" : show_list}, function(listcheck){
      var today = Date.now();
      storage.set({"showListDate" : today}, function(check){
            //console.log("show list created to empty. show list : " + check.showList);
      });
      console.log("show list should have been pushed? It's size is: " + listcheck.showList.length)});
    }

    if(images != undefined && images.length != 0){
      try{
        storage.set({"imageList" : images}, function(result){
          document.getElementById("showid_" + this_num).src = result.imageList[this_num]});
      }
      catch(err){
        //TypeError: Cannot set property 'src' of null
      }
    }

    if(descrips != undefined && descrips.length !=0){
        descrips = [];
        storage.set({"descripList" : descrips});
    }
}


function getAllAnimeYears(){
  reloadTwitterButton("Hamtaro");
  createTable("home"); 

  storage.get(function(result){

    //accounting for potential first load
    if(result.showListDate == undefined){
      dateToStore = 0;
    }
    else{
      dateToStore = result.showListDate;
    }

    if(result.showList == undefined){
      //console.log("Undefined show list was caught...");
      
      var lastPulled = Date.now() - dateToStore;
      var updateWhen = 31556952000; //num milliseconds in a year
     
      if(lastPulled > updateWhen){
        //console.log("Need to update the show list in storage...");
        
        for(var i = 1961; i <= 2015; i++){
          loadWikiData(i);
        }
        
        storage.set({"showList" : showsToStore}, function(datecheck){
          //console.log("stored date is: " + datecheck.showListDate)
        });
        

        
      }
      else{
        //console.log("It's not time to update show list...");

      }
      
      storage.get(function(results){
        //console.log("After updating the show list if needed, there are " + results.showList.length + " items in the stored show list.");
      });


     }
    else{
      //console.log("Show list was not undefined, will handle this later?...");
      storage.get(function(result){console.log("There should be data in the stored list. Exactly " + result.showList.length + " items are stored there.")});
      
    }

    

  });
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
            
      }
      
    }
    xmlhttp.open("GET","http://en.wikipedia.org/wiki/Category:" + year +"_anime_television_series",true);
    xmlhttp.send();
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
      }
      
    }
    xmlhttp.open("GET","http://en.wikipedia.org/wiki/" + show_list[this_num],true);
    xmlhttp.send();
}

function reloadTwitterButton(show){

  document.getElementById("twitterContainer").innerHTML = "";

  var link = document.createElement('a');
  link.setAttribute('href', 'https://twitter.com/int?screen_name=');
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
    var upcoming = document.getElementById('upcoming');
    var toHome = document.getElementById('toHome');
    
    addToBox.addEventListener('click', function() {
        var show = document.getElementById('shows').value;

        //reload twitter button with new show
        reloadTwitterButton(show);

        //This is where the new page will be loaded from!----------------------
        document.getElementById('shows').value = "";

        //Handles adding the show to the user's list
        addShowToBox(show,true);

        //Just making sure the lists is stored as soon as possible
        storeListPlease();
        
    });

    upcoming.addEventListener('click', function() {
          console.log("The user wants to view upcoming page...");

          document.getElementById('bg').innerHTML = "<b>Upcoming Shows Page Here</b>";

          //Just making sure the show list is stored as soon as possible
          storeListPlease();
                  
    });

    toHome.addEventListener('click',function() {
        console.log("The user wants to return to home page...");

        createTable("home");

        storeListPlease();
    });

});

function addShowToBox(show,fromHome){
  storage.get(function(result){

        //makes sure it is actually a show and then adds it to the user's list
        var isShow = false;
        if(show_list == 0){
          for(var i = 0; i < result.showList.length; i++){
            if(show == result.showList[i]){
              isShow = true;
              break;
            }
          }
        }
        else{

          for(var i = 0; i < show_list.length; i++){
            if(show == show_list[i]){
              isShow = true;
              break;
            }
          }
        }

        //last check should make it unique?       
        if(isShow && $.inArray(show,result["shows"]) == -1){     
                    
            if(typeof(result["shows"]) !== 'undefined' && result["shows"] instanceof Array) {
              result["shows"].push(show);
            }
            else{
              result["shows"] = [show];
            }
            storage.set(result);
            if(fromHome){
              createTable("home");
            }
        }
        else{
          console.log("Get here by putting in a show already on your list or something that isn't a show! We need to notify the user somehow.");
        }
        });
}
