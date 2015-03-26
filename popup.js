var numAnime = 0;
var nameNum = 0;
var today = new Date();

//Handling of the show list
var show_list = [];
var images = [];
var descrips = "";
var ongoing = "";
var whereToWatch = [];

var fb_shows_user = [];
var fb_shows_friends = [];

//For storage and user show list
var storage = chrome.storage.local;
var usershows = [];

var userFBShows = [];
var sharedShows = [];

//Storage for the episode dates
var month = [];
var this_month = today.getMonth()+1;
var this_year = today.getFullYear();

//Hanlding of the Social Media
var fb_connectStatus = "nope";
var fb_accessToken = "nope";
var fb_userID = "nope";

window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));

function loadEpisodeData()
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

            var date_page = xmlhttp.responseText;
			var date_table = $("table",date_page); //calling the table 
			//for table 
			var tbody1 = $("tbody", date_table);
			$("td", tbody1).each(function(){
				var thead_data = $("thead", this);
				var first_tr = $("tr", thead_data);
				var h2_thing = $("h2", first_tr);
				var date = $("a", h2_thing).attr("href");
				if(date != undefined && date.length != 0){
				console.log("the date is: " + date);
				}
				
				var tbody_data = $("tbody:first", this);
				var day = [];
				$("tr", tbody_data).each(function(){
					var tr_stuff = this;
					var h3stuff = $("h3",tr_stuff);
					var show_title = $("a", h3stuff).attr("href");
					if(show_title != undefined && show_title.length != 0){
						var show_arr = show_title.split("/");
						var name = show_arr[3].replace(/_/g, ' ');
						name = name.replace(/%3A/g, ":");
						name = name.replace(/%21/g, "!");
						name = name.replace(/%E2%80%83/g, " ''");
						//name = name.replace(/ /g, ":");
						//name = name.replace(/ /g, "");
						name = name.replace(/%28/g, "(");
						name = name.replace(/%29/g, ")");
						name = name.replace(/%40/g, "@");
						//name = name.replace(/ /g, ":");
						//name = name.replace(/ /g, "");
						day.push(name);
						console.log("the show title is: " + name);
					}
				});
				console.log("month is being popped.")
				month[date] = day;
			});
			console.log("month is:");
			console.log(month);
		//console.log("the show title is: " + show_date);
			/*
			$("thead",date_table)(function(){
				var h2 = $("h2", this);
				var date = $("a", h2).attr("href");
				console.log(date);
				//do stuff to get variables
				//
			}); //maybe? as a start? im not sure

			*/
			createTable("upcoming");
      }
      
    }
    xmlhttp.open("GET","http://animecalendar.net/" + this_year + "/" + this_month,true);
    xmlhttp.send();
}

function getEpisodeDates(){
	for(var i = this_month; i <= this_month+1; i++){
    loadEpisodeData();
  }
} 

function getFileData(thisFile){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", thisFile, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;

                if(thisFile === "store.txt"){
                  show_list = allText.split(",");
                  storage.set(
                    {"showList" : show_list},
                    function(result){
                      console.log(result);
                      $( "#shows" ).autocomplete({
                        source: show_list
                      });
                    }
                  );
                }
                else{
                  images = allText.split(",");
                  storage.set(
                    {"imageList" : images},
                    function(result){
                      console.log(result);
                    }
                  );
                }
                /*for(var i = 0; i < show_list.length; i++){
                  loadShowData(i);
                }*/


            }
        }
    }
    rawFile.send(null);
}

function getShows(){
  storage.get(function(result){
    if(result.showList != undefined){
      $( "#shows" ).autocomplete({
        source: result.showList
      });
    }
    else{
      getFileData("store.txt");
      getFileData("imageStore.txt");
    }
  });
 
}

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
function postFB(){
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
      }
    }
    xmlhttp.open("POST","https://graph.facebook.com/v2.2/me/feed?access_token=" + fb_accessToken + "&message=hello&caption=world&description=test",true);
    xmlhttp.send();
}
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
            createTable("home");
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

  $('<p id="helper">').appendTo('#bg');
  $('<table id="show_grid">').appendTo('#bg');

  var table = document.getElementById("show_grid");

  if(page == "home"){    
    table.innerHTML = "";
    
    var temp = "http://media1.popsugar-assets.com/files/2014/02/18/159/n/28443503/5945b74bba9e1117_shutterstock_105361820.jpg.xxxlarge/i/Calories-Sushi.jpg";

    storage.get(function(result){ 
      
      //creating friend shows
      for(var i = 0; i < fb_shows_friends.length; i++){
        var index = $.inArray(fb_shows_friends[i],result.showList);
        if(index != -1 && $.inArray(fb_shows_friends[i],sharedShows) == -1){
          if(sharedShows instanceof Array){
            sharedShows.push(fb_shows_friends[i]);
          }
          else{
            sharedShows = fb_shows_friends[i];
          }
        }
      }
          
      for(var ss = 0; ss < sharedShows.length; ss+=2){
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        row.className = "row";
      
        var showID = -1;
        if(result.showList !=undefined){
          showID = $.inArray(sharedShows[ss],result.showList);
        }

        var bento = ($("<div>").addClass("bento titlelink").attr("id",sharedShows[ss]));
        bento.html("<br><center><a class='titlelink' id = '" + sharedShows[ss] + "' href='http://en.wikipedia.org/wiki/" + sharedShows[ss] + "'>" + sharedShows[ss] + "</a></center>");
        bento.appendTo(cell1);
        //var box = ($("<div>").addClass("boxF"));

          ($("<div>").addClass("boxF").append(
            $("<div>").addClass("innerboxF").append(
            $("<div>").addClass("colRoll").append(
              $("<div>").addClass("roll").html(
                  "<br><br><img src ='" + 
                  result.imageList[showID] + "' class='img-circle sushi' ></img>"))))).appendTo(bento);
          
        if(sharedShows.length % 2 != 0 && ss == sharedShows.length-1){
            var bento2 = ($("<div>").addClass("bento titlelink").css( "padding-top", "45px" ));
            bento2.appendTo(cell2);          

          ($("<div>").addClass("boxF").append(
            $("<div>").addClass("innerboxF").append(
            $("<div>").addClass("colRoll").append(
              $("<div>").addClass("roll").html(
                  "<br><br><img src ='" + 
                  temp + "' class='img-circle sushi' ></img>"))))).appendTo(bento2);
          }
          else{

          var showID = -1;
          if(result.showList !=undefined){
            showID = $.inArray(sharedShows[ss+1],result.showList);
          }
            var bento2 = ($("<div>").addClass("bento titlelink").attr("id",sharedShows[ss+1]));
            bento2.html("<br><center><a class='titlelink' id = '" + sharedShows[ss+1] + "' href='http://en.wikipedia.org/wiki/" + sharedShows[ss+1] + "'>" + sharedShows[ss+1] + "</a></center>");
            bento2.appendTo(cell2);
            ($("<div>").addClass("boxF").append(
             $("<div>").addClass("innerboxF").append(
              $("<div>").addClass("colRoll").append(
                $("<div>").addClass("roll").html(
                  "<br><br><img src ='" + 
                  result.imageList[showID] + "' class='img-circle sushi' ></img>"))))).appendTo(bento2);
          }
      }

      //creating user shows from FB
      for(var i = 0; i < fb_shows_user.length; i++){
        var index = $.inArray(fb_shows_user[i],result.showList);
        if(index != -1 && $.inArray(fb_shows_user[i],userFBShows) == -1){
          if(userFBShows instanceof Array){
            userFBShows.push(fb_shows_user[i]);
          }
          else{
            userFBShows = fb_shows_user[i];
          }
        }
      }
          
      for(var ss = 0; ss < userFBShows.length; ss+=2){
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        row.className = "row";
      
        var showID = -1;
        if(result.showList !=undefined){
          showID = $.inArray(userFBShows[ss],result.showList);
        }

        var bento = ($("<div>").addClass("bento titlelink").attr("id",userFBShows[ss]));
        bento.html("<br><center><a class='titlelink' id = '" + userFBShows[ss] + "' href='http://en.wikipedia.org/wiki/" + userFBShows[ss] + "'>" + userFBShows[ss] + "</a></center>");
        bento.appendTo(cell1);
        //var box = ($("<div>").addClass("boxF"));

          ($("<div>").addClass("boxUF").append(
            $("<div>").addClass("innerboxF").append(
            $("<div>").addClass("colRoll").append(
              $("<div>").addClass("roll").html(
                  "<br><br><img src ='" + 
                  result.imageList[showID] + "' class='img-circle sushi' ></img>"))))).appendTo(bento);
          
        if(userFBShows.length % 2 != 0 && ss == userFBShows.length-1){
            var bento2 = ($("<div>").addClass("bento titlelink").css( "padding-top", "45px" ));
            bento2.appendTo(cell2);          

          ($("<div>").addClass("boxUF").append(
            $("<div>").addClass("innerboxF").append(
            $("<div>").addClass("colRoll").append(
              $("<div>").addClass("roll").html(
                  "<br><br><img src ='" + 
                  temp + "' class='img-circle sushi' ></img>"))))).appendTo(bento2);
          }
          else{

          var showID = -1;
          if(result.showList !=undefined){
            showID = $.inArray(userFBShows[ss+1],result.showList);
          }
            var bento2 = ($("<div>").addClass("bento titlelink").attr("id",userFBShows[ss+1]));
            bento2.html("<br><center><a class='titlelink' id = '" + userFBShows[ss+1] + "' href='http://en.wikipedia.org/wiki/" + userFBShows[ss+1] + "'>" + userFBShows[ss+1] + "</a></center>");
            bento2.appendTo(cell2);

            ($("<div>").addClass("boxUF").append(
             $("<div>").addClass("innerboxF").append(
              $("<div>").addClass("colRoll").append(
                $("<div>").addClass("roll").html(
                  "<br><br><img src ='" + 
                  result.imageList[showID] + "' class='img-circle sushi' ></img>"))))).appendTo(bento2);
          }
      }


      //creating from stored user list
      if(result.shows == null || result.shows == undefined){
        ($('#helper').text("Add shows to your list with the search bar above!"/*<br><br>Important Notes:<br>The inital load requires an internet connection to function properly, and there might be some lag on this initial opening depending on your internet connection speed. We apologize for the trouble :("*/
          ));
        
      }
      else{
        var size = result.shows.length;

        for(var cell = 0; cell < size; cell +=2){
          var row = table.insertRow(0);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          row.className = "row";
          
          var showID = -1;
          if(result.showList != null || result.showList != undefined){
            var showID = $.inArray(result.shows[cell],result.showList);
          }
        var bento = ($("<div>").addClass("bento titlelink").attr("id",result.shows[cell]));
        bento.html("<br><center><a class='titlelink' id = '" + result.shows[cell] + "' href='http://en.wikipedia.org/wiki/" + result.shows[cell] + "'>" + result.shows[cell] + "</a></center>");
        bento.appendTo(cell1);
        //var box = ($("<div>").addClass("boxF"));

          ($("<div>").addClass("boxU").append(
            $("<div>").addClass("innerbox").append(
            $("<div>").addClass("colRoll").append(
              $("<div>").addClass("roll").html(
                  "<br><br><img src ='" + 
                  result.imageList[showID] + "' class='img-circle sushi' ></img>"))))).appendTo(bento);
          
          //leaving a trailing empty box if the num of user shows is odd, or filling it as needed~
          //--LEFT UNDONE-- putting the trailing box at the bottom?
          
          if(size % 2 != 0 && cell == size-1){

            var bento2 = ($("<div>").addClass("bento titlelink").css( "padding-top", "45px" ));
            bento2.appendTo(cell2);

          ($("<div>").addClass("boxU").append(
            $("<div>").addClass("innerbox").append(
            $("<div>").addClass("colRoll").append(
              $("<div>").addClass("roll").html(
                  "<br><br><img src ='" + 
                  temp + "' class='img-circle sushi' ></img>"))))).appendTo(bento2);
          }
          else{
            var showID = -1;
            if(result.showList != null || result.showList !=undefined){
              showID = $.inArray(result.shows[cell+1],result.showList);
            }
              var bento2 = ($("<div>").addClass("bento titlelink").attr("id",result.shows[cell+1]));
              bento2.html("<br><center><a class='titlelink' id = '" + result.shows[cell+1] + "' href='http://en.wikipedia.org/wiki/" + result.shows[cell+1] + "'>" + result.shows[cell+1] + "</a></center>");
              bento2.appendTo(cell2);
              //var box = ($("<div>").addClass("boxF"));

                ($("<div>").addClass("boxU").append(
                  $("<div>").addClass("innerbox").append(
                  $("<div>").addClass("colRoll").append(
                    $("<div>").addClass("roll").html(
                        "<br><br><img src ='" + 
                        result.imageList[showID] + "' class='img-circle sushi' ></img>"))))).appendTo(bento2);
          }

        }
      }

      addLinkOnClick(result.shows); 

    });
  }
  if(page == "help"){
    
    ($('<h4>').text("Why are some boxes Red and some boxes Blue?")).appendTo('#bg');
    ($('<p>').text("The boxes that are Red contain the shows specifically in your box. The boxes that you see as Blue are shows that your Facebook friends have liked if you connected to Facebook!")).appendTo('#bg');
    
    ($('<h4>').text("Why do some boxes only have a sushi in them?")).appendTo('#bg');
    ($('<p>').text("This sushi is a placeholder for a show. Add more shows to your TomodachiBox to make it disappear!")).appendTo(bg);
    
    ($('<h4>').text("What do I do if something seems drastically wrong???")).appendTo('#bg');
    ($('<p>').text("Please! We urge you to contact us (the development team) as soon as possible! We don't bite, and we would be happy to help you. :) ")).appendTo('#bg');
    
    //($('<h4>').text()).appendTo(bg);
    //($('<p>').text()).appendTo(bg);
  }
      if(page == "upcoming"){
	  //get the date
	  //translate to /year/month/day format
	  //compare against dates in the month[] array
	  //have the date and the showlist for the day be presented on the page.
	  storage.get(function(result){
		  var new_date = new Date();
		  var day_check = new_date.getDate();
		  var month_check = new_date.getMonth()+1;
		  var year_check = new_date.getFullYear();
		
		  
		  var bg =  document.getElementById("bg");
		  bg.innerHTML = "";
		  ($('<table>').attr("id","cont")).appendTo('#bg');
		  
		  var tbl = document.getElementById("cont");
		  console.log("month is: ");
		  console.log(month);
		  for(var d = day_check+2; d > day_check-1; d--){
			  console.log("d is:" +d);
			  var date_check = "/"+year_check+"/"+month_check+"/"+d;
			  for(var i = 0; i < month[date_check].length; i++){
						
						var row0 = tbl.insertRow(0);
						var cell0a = row0.insertCell(0);
						var cell0b = row0.insertCell(1);
						row0.className = "row";
						
						cell0a.innerHTML = (month[date_check][i]);
						cell0b.innerHTML = (date_check);
						//(month[date_check][i]).appendTo(cell0a);
						//(date_check).appendTo(cell0b);
					 
						
			  }
			  
		  }
		  for(var b = day_check+2; b > day_check-1; b--){
			  console.log("d is:" +b);
			  var date_check = "/"+year_check+"/"+month_check+"/"+b;
			  for(var h = 0; h < month[date_check].length; h++){
				  console.log("just checking shows size" + month[date_check][h]);
					for(var j = 0; j < result.shows.length; j++){
						 if(result.shows[j] == month[date_check][h]){
							 console.log("found show: " + result.shows[j]);
							var row0 = tbl.insertRow(0);
							var cell0a = row0.insertCell(0);
							var cell0b = row0.insertCell(1);
							row0.className = "row";
							
							cell0a.innerHTML = (month[date_check][h]);
							cell0b.innerHTML = (date_check);
						 }
					}
				  }
		  }
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
       makeShowPage(this.id);
    }
  }
}
function showPage(showname,result, showID){

  var space = document.getElementById("bg");
  space.innerHTML = "";
  var title_show = document.createElement("div");
  title_show.className = "row page-header";
  var title_text = document.createElement("div");
  title_text.className = "col-md-8";
  title_text.innerHTML = "<h2>" + showname + "</h2>";
  

  var show_table = document.createElement("div");
  show_table.className = "container";
  var row1 = document.createElement("div");
  row1.className = "row";
  var col1 = document.createElement("div");
  var col2 = document.createElement("div");
  var button1 =  document.createElement("button");
  var button2 = document.createElement("button");
  button1.id = "spAdd";
  button2.id = "spRemove";
  button1.className = "spBtn btn btn-default btn-lg";
  button2.className = "spBtn btn btn-default btn-lg";
  button1.innerHTML = "<div><span class='glyphicon glyphicon-plus' style='vertical-align:middle'> </span> to Bento</div>";
  button2.innerHTML = "<div><span class='glyphicon glyphicon-minus' style='vertical-align:middle'> </span> from Bento</div>";
  button1.style.display = "block"; 
  button1.style.width = "100%";
  button2.style.display = "block";
  button2.style.width = "100%";

  var row2 = document.createElement("div");
  row2.className = "row";
  var col2_1 = document.createElement("div");
  col2_1.className = "col-lg-12 boxU";
  var divRoll = document.createElement("div");
  divRoll.className = "colRoll";
  var divBox = document.createElement("div");
  divBox.className = "innerbox";
  var img_show = document.createElement("img");
  img_show.className = "roll img-circle";
  img_show.src = result.imageList[showID];
  //img_show.style.width = "100%";
  var row3 = document.createElement("div");
  row3.className = "row";
  var col3_1 = document.createElement("div");
  var col3_2 = document.createElement("div");
  col3_1.className =  "col-md-6";
  col3_2.className =  "col-md-6";
  col3_1.innerHTML = "<small>" + ongoing + "</small><br><br>";
  col3_2.innerHTML = descrips;

  title_show.appendChild(title_text);
  var col1_1 = document.createElement("div");
  col1_1.className = "col-md-4";
  col1.appendChild(button1);
  col2.appendChild(button2);
  col1_1.appendChild(col1);
  col1_1.appendChild(col2);
  col1_1.style.cssFloat = "right";

  title_text.style.cssFloat = "left";
  title_show.appendChild(col1_1);
  divRoll.appendChild(img_show);
  divBox.appendChild(divRoll);
  col2_1.appendChild(divBox);
  row2.appendChild(col2_1);
  row3.appendChild(col3_1);
  row3.appendChild(col3_2);

  space.appendChild(title_show);
  show_table.appendChild(row1);
  show_table.appendChild(row2);
  show_table.appendChild(row3);

  space.appendChild(show_table);

  descrips = "";
  ongoing = "";
  whereToWatch = [];
}
function loadShowData(showname,result, showID)
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
            var wiki_descrip = $("#mw-content-text", wiki_page);
            var descrips1 = $("h2",wiki_descrip).filter(":contains('Plot')").next();
            var descrips2 = $("h2",wiki_descrip).filter(":contains('Plot')").next("p").text();
            var count = 0;
            if(descrips2 && descrips2.length > 0){
              descrips = descrips2;
            }
            else{
              while(true){
                console.log(count);
                if(descrips1.next("p").text() && descrips1.next("p").text().length > 0){
                  descrips = descrips1.next("p").text();
                  break;
                }
                if(count > 6){
                  descrips = $("p:first", wiki_descrip).text();
                  break;
                }
                descrips1 = descrips1.next();
                count++;
              }
            }


            
            var anime_info = $("tr",wiki_infobox).filter(":contains('Anime television series')").nextUntil().filter(":contains('Original run')").text();
            //var show_info_date = $("tr",anime_info).filter(":contains('Original run')");
            ongoing = anime_info;
            console.log(anime_info);
            whereToWatch = [];   
            showPage(showname,result, showID);   
      }
      
    }
    xmlhttp.open("GET","http://en.wikipedia.org/wiki/" + showname,true);
    xmlhttp.send();
}
function makeShowPage(showname){

  storage.get( function(result){
    var showID = -1;
    if(result.showList != null || result.showList != undefined){
      showID = $.inArray(showname,result.showList);
    }
    loadShowData(showname,result, showID);
  });
}

function getAllAnimeYears(){
  reloadTwitterButton("Hamtaro");
  getShows();
  createTable("home"); 
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
    var helpPls = document.getElementById('helpPls');
    var fb_button = document.getElementById('fb_post_button');

    addToBox.addEventListener('click', function() {

        chrome.browserAction.setIcon({path: 'icon.png'});

        var show = document.getElementById('shows').value;

        //reload twitter button with new show
        reloadTwitterButton(show);

        //This is where the new page will be loaded from!----------------------
        document.getElementById('shows').value = "";

        //Handles adding the show to the user's list
        addShowToBox(show,true);
        
    });

   upcoming.addEventListener('click', function() {
          console.log("The user wants to view upcoming page...");
			getEpisodeDates();
          document.getElementById('bg').innerHTML = "<b>Upcoming Shows Page is Loading...</b>";
                  
    });

    toHome.addEventListener('click',function() {
        console.log("The user wants to return to home page...");

        createTable("home");
    });

    helpPls.addEventListener('click',function() {
        console.log("The user wants to get help!...");

        createTable("help");
    }); 

    fb_button.addEventListener('click',function() {
        postFB();
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
