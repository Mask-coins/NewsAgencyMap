var map;
var sparql = ""

$(document).ready(function() {
  initMap();

  // Selectタグの変化
  $("select").change(function() {
    if (this.value !== "-選択してください-") {
      sparql = "PREFIX dbpedia: <http://ja.dbpedia.org/resource/> PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> PREFIX prop-ja: <http://ja.dbpedia.org/property/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT distinct ?name, ?label WHERE { ?pref rdf:type dbpedia-owl:Place; dbpedia-owl:wikiPageWikiLink category-ja:日本の都道府県; prop-ja:都道府県名 ?name; prop-ja:" + this.value + " ?o . ?o rdfs:label ?label. }"
      d3sparql.query("http://ja.dbpedia.org/sparql", sparql, render)
    }
  });
});

// Mapへのマーカー描画
function render(json) {
  // initMap();
  var dict = {};
  $.each(json["results"]["bindings"], function(key, value) {
    dict[value["name"]["value"]] = value["label"]["value"]
  });
  $.each(latlnglist["marker"], function(key, value) {
    var pref = value["pref"]
    var lat = value["lat"]
    var lng = value["lng"]
    var marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup("<span>" + pref + ": " + dict[pref] + "</span>").openPopup();
  });
}

// Mapの初期化
function initMap() {
  map = L.map('gmap').setView([35.619, 139.751], 8);

  // 地理院地図レイヤー追加
  L.tileLayer(
    // 地理院地図利用
    'http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
    {
      attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
    }
  ).addTo(map);
}
