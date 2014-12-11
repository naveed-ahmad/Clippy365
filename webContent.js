function getWikipediaArticle(name,agent, callback){
	agent.stopSpeaking();
	agent.speak("Searching...");
	agent.play("Searching");
	var wikiURL = "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + encodeURIComponent(name);
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			var wikiData = jQuery.parseJSON(xmlhttp.responseText);
			if("parse" in wikiData && "text" in wikiData["parse"] && "*" in wikiData["parse"]["text"]){
				callback(wikiData["parse"]["text"]["*"]);
				agent.stopSpeaking();
			} else {
				callback("");
			}
		} else {
			callback("");
		}
	}
	xmlhttp.open("GET",wikiURL,true);
	xmlhttp.send();
	
}