var map;
var sparql = ""

$(document).ready(function() {
  initMap();
  document.getElementById("status").innerHTML = "取得中";
  sparql = "PREFIX newa:<http://www.coins.tsukuba.ac.jp/~s1711348/NewaAgencyInfo/property/> PREFIX ccode:<http://www.coins.tsukuba.ac.jp/~s1711348/CityCode/property/> PREFIX dbp-owl: <http://dbpedia.org/ontology/> PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> PREFIX prop-ja: <http://ja.dbpedia.org/property/> SELECT ?city ?agensy ?site ?lat ?long WHERE {  ?s newa:新聞社 ?agensy .  ?s newa:拠点 ?site .  ?s newa:都市 ?city .  ?CityCode ccode:都市 ?city .  ?CityCode ccode:記事名 ?d .OPTIONAL { SERVICE <http://ja.dbpedia.org/sparql>{?d geo:lat ?lat .?d geo:long ?long .}}}ORDER BY ?city";
  //document.getElementById("status").innerHTML = sparql;
  d3sparql.query("http://localhost:3030/NewaAgencyInfo/query", sparql, render)
});

// Mapへのマーカー描画
function render(json) {
  //document.getElementById("status").innerHTML = "取得完了";
  //initMap();
  var dict = {};
  var marker;
  var cityStr;
  var cityLat;
  var cityLng;
  $.each(json["results"]["bindings"], function(key, value) {
    if (value["lat"]){
      //var marker;
      if(dict[value["city"]["value"]]){
        document.getElementById("status").innerHTML = value["city"]["value"];
        cityStr = cityStr + "<BR>" + value["agensy"]["value"] + " " + value["site"]["value"]
        //marker = L.marker([cityLat, cityLng]);
        //map.removeControl(marker);
        //https://github.com/Leaflet/Leaflet/issues/4868
        //marker = dict[value["city"]["value"]]
        //map.remove(marker);
        marker = L.marker([cityLat, cityLng]).addTo(map);
        marker.bindPopup(cityStr).openPopup();
      }else{
        var siteCity = new Object();
        siteCity.city = value["city"]["value"];
        siteCity.lat =  value["lat"]["value"];
        siteCity.lng =  value["long"]["value"];
        cityStr = siteCity.city;
        cityLat = siteCity.lat;
        cityLng = siteCity.lng;
        siteCity.str = siteCity.city + "<BR>" + value["agensy"]["value"] + " " + value["site"]["value"]
        marker = L.marker([siteCity.lat, siteCity.lng]).addTo(map);
        //marker._id = value["city"]["value"];
        marker.bindPopup(siteCity.str).openPopup();
        dict[value["city"]["value"]] = marker;
      }
    }
  });
  //$.each(dict, function(key, value) {
  //  var marker = L.marker([value.lat, value.lng]).addTo(map);
  //  marker.bindPopup(value.str).openPopup();
  //  document.getElementById("status").innerHTML = value.city + "\n" + value.str;
  //});
  document.getElementById("status").innerHTML = "完了";
}



// Mapの初期化
function initMap() {
  map = L.map('gmap').setView([35.619, 139.751], 3);

  // 地図レイヤー追加
  L.tileLayer(
    // OpenStreetMap利用
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: 'c <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }
  ).addTo(map);
}
