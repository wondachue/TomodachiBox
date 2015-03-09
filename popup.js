var numAnime = 0;

var show_list = [];
var images = [];
var descrips = [];

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
    cell1.innerHTML = "<div class='box'><div class='innerbox'><div class='col'><div class='roll'><a href='http://en.wikipedia.org/wiki/" + show_list[cell] + "'>" + show_list[cell] + "</a><br><img id = 'showid_" + cell + "' src ='" + temp + "' class='img-circle sushi'></img></div></div></div></div>";
    cell2.innerHTML = "<div class='box'><div class='innerbox'><div class='col'><div class='roll'><a href='http://en.wikipedia.org/wiki/" + show_list[cell + 1] + "'>" + show_list[cell + 1] + "</a><br><img id = 'showid_" + cell + "' src ='" + temp + "' class='img-circle sushi'></img></div></div></div></div>";
  }
}
function getAllAnimeYears(){
  for(var i = 1961; i <= 2015; i++){
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