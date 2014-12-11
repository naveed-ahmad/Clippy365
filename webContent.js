function getWikipediaArticle(name){
	var wikiURL = "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + encodeURIComponent(name);
	var request = new XMLHttpRequest();
	request.open("GET",wikiURL,false);
	request.send();
	if (request.status !== 200) {
		log("error getting data");
		return "";
	}
	var wikiData = jQuery.parseJSON(request.responseText);
	if("parse" in wikiData && "text" in wikiData["parse"] && "*" in wikiData["parse"]["text"]){
		return wikiData["parse"]["text"]["*"];
	} else {
		return "";
	}
}