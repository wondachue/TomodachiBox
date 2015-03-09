var numAnime = 0;

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
  getAllAnimeYears();
});
function createTable(){
  var table = document.getElementById("show_grid");
  for(var cell = 0; cell < show_list.length; cell+=2){
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    row.className = "row";
    cell1.innerHTML = "<div class='box'><div class='innerbox'><div class='col'><div class='roll'><a href='http://en.wikipedia.org/wiki/" + show_list[cell] + "'>" + show_list[cell] + "</a></div></div></div></div>";
    cell2.innerHTML = "<div class='box'><div class='innerbox'><div class='col'><div class='roll'><a href='http://en.wikipedia.org/wiki/" + show_list[cell + 1] + "'>" + show_list[cell + 1] + "</a></div></div></div></div>";
  }
}
function getAllAnimeYears(){
  for(var i = 1961; i <= 2015; i++){
    loadWikiData(i);
  }
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
              if($(this).attr("title") != "undefined" && $(this).attr("title").length != 0){
                show_list[numAnime] = $(this).attr("title");
                numAnime++;
              }
            });
            createTable();
      }
      
    }
    xmlhttp.open("GET","http://en.wikipedia.org/wiki/Category:" + year +"_anime_television_series",true);
    xmlhttp.send();
}