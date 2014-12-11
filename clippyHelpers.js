FULL_OPTIONS = [
					{
						"name":"letterWriting",
						"text":"Writing a letter",
						"data":{},
						"callback":writingLetter
					},
					{
						"name":"createEvent",
						"text":"Create an event in my calendar",
						"data":{},
						"callback":createEvent
					},
					{
						"name":"findLocation",
						"text":"Find information about a location",
						"data":{},
						"callback":findLocation
					},
					{
						"name":"findAddress",
						"text":"Find an address",
						"data":{},
						"callback":findAddress
					},
					{
						"name":"similarImages",
						"text":"Find similar images",
						"data":{},
						"callback":similarImages
					},
					{
						"name":"wikipedia",
						"text":"Find information about on Wikipedia",
						"data":{},
						"callback":wikipedia
					},
					{
						"name":"findPeople",
						"text":"Find information about a person",
						"data":{},
						"callback":findPeople
					},
					{
						"name":"plagiarism",
						"text":"Check for plagiarism",
						"data":{},
						"callback":plagiarism
					}
				];

BASE_OPTION = {"name":"unknown","text":"Placeholder text","callback":null};
	

function addClippyOptions(options){
	log("Options");
	document.getElementById('clippy-buttons').innerHTML = "";
	this.currentClippyOptions = options;
	log("Adding options");
	for(var i = 0; i < options.length; i++){
		var option = options[i];
		document.getElementById('clippy-buttons').innerHTML += '<span class="clippy-option-button"><input onchange="runClippyOption();" type="radio" name="clippy-option" value="' + option["name"] + '">' + option["text"] + '</span>';
	}
	
}

function runClippyOption(){
	var buttons = document.getElementsByName('clippy-option');
	var selectedValue = "";
	for(var i = 0; i < buttons.length; i++){
		var button = buttons[i];
		if(button.checked){
			selectedValue = button.value;
			break;
		}
	}
	
	if(selectedValue == ""){
		log("Unknown value");
		return;
	}
	
	if(selectedValue == "defaultcancel"){
		log("cancelling");
		addClippyOptions([]);
		agent.stopSpeaking();
		return;
	}
	
	for(var i = 0; i < this.currentClippyOptions.length; i++){
		var option = this.currentClippyOptions[i];
		if(option["name"] == selectedValue){
			log('Calling callback');
			option["callback"](option["data"]);
			return;
		}
	}
	log("No callback found");
}

function isLetter(data){
	var tokens = scanLetterForTokens(data);
	if(	tokens["addressee"].length != 0 &&
		tokens["author"].length != 0 &&
		tokens["greeting"].length != 0)
	{
		return true;
	}
	return false;
}

function scanLetterForTokens(letter){
	tokens = { 	"addressee":"",
				"author":"",
				"greeting":""};
	
	parts = letter.replace("\r"," ");
	parts = parts.replace("\n"," ");
	parts = parts.replace("  "," ");
	parts = parts.split(" ");
	
	if(parts.length < 2){
		return tokens;
	}
	
	tokens["author"] = "Clippy";
	
	// Check the first word for a to
	var greeting = parts[0].toLowerCase().trim();
	if(greeting == "to" && (parts[1].toLowerCase() == "who" || parts[2].toLowerCase() == "whom")){
			//To whom it may concern....
			tokens["greeting"] = "To";
			tokens["addressee"] = "whom it may concern, ";
			return tokens;
	} else if(greeting == "to"){
		tokens["greeting"] = "To";
	} else if(greeting == "dear"){
		tokens["greeting"] = "Dear";
	} else {
		//Don't appear to have a letter
		return tokens;
	}
	
	//Find addressee:
	//To Mr Bond, Mrs K Winslow, Dr. James Hunter

	for(var i = 1; i < parts.length; i++){
		if(parts[i].indexOf(",") > -1){ //Contains a comma
			text = [];
			for(var j = 1; j <= i; j++){
				if(j < i){
					text.push(parts[j]);
				} else {
					text.push(parts[j].replace(",",""));
					break;
				}
			}
			tokens["addressee"] = text.join(" ");
			break;
		} 
	}
	
	return tokens;
}

function scanForAddresses(text)
{
	var expression = /\d{1,5} ([A-Za-z0-9]+ ?){2,5}, ([A-Za-z0-9]+, )?\w+, \w+,? \d{5}/g;
	var matches = this.documentData.match(expression);
	if(matches == null){
		matches = [];
	}
	return matches;
}

function insertTemplate(type,data){
	tokens = scanLetterForTokens(documentData);
	var letter = "";
	if(type == "personal"){
		letter = "{GREETING} {ADDRESSEE},\r\n[Write a brief introduction to what your letter is about]\r\n[Write a more detailed explaination here]\r\n[Thank them for your work]\r\nSincerely,\r\n\r\n{AUTHOR}";
	} else {
		letter = "{GREETING} {ADDRESSEE},\r\n[Write a brief introduction to what your letter is about (I have no idea what goes into a business letter so I'm pretending)]\r\n[Write a more detailed explaination here]\r\n[Thank them for your work]\r\n\r\nSincerely,\r\n\r\n{AUTHOR}";
	}
	
	if(tokens["greeting"].length == 0){
		tokens["greeting"] = "Dear";
	}
	if(tokens["addressee"].length == 0){
		tokens["addressee"] = "Sir/Madam";
	}
	
	letter = letter.replace("{GREETING}",tokens["greeting"]);
	letter = letter.replace("{ADDRESSEE}",tokens["addressee"]);
	letter = letter.replace("{AUTHOR}",tokens["author"]);
	
	insertIntoDocument(letter);
}

function writingLetter(data){
	this.clippyInAction = true;
	if(Object.keys(data).length == 0){
		//This is the first call so we present the initial options
		agent.speak("So you are writing a letter. What would you like help with?");
		addClippyOptions([
							{
								"name":"insertTemplate",
								"text":"Insert a letter template",
								"data":{"type":"inserttemplate"},
								"callback":writingLetter
							},
							{
								"name":"findTemplates",
								"text":"Find example letters online",
								"data":{"type":"onlinetemplates"},
								"callback":writingLetter
							},
						]);
		return;
	} 
	
	//We were the caller so we are doing letter specific stuff
	switch(data["type"]){
		case "writing":
			agent.speak("Looks like you are writing a letter. Would you like to use some of the help features?");
			addClippyOptions([
							{
								"name":"personalTemplate",
								"text":"Insert a personal letter template",
								"data":{"type":"inserttemplate", "templatetype":"personal"},
								"callback":writingLetter
							},
							{
								"name":"businessTemplates",
								"text":"Insert a business letter template",
								"data":{"type":"inserttemplate", "templatetype":"business"},
								"callback":writingLetter
							}, 
							{
								"name":"cancel",
								"text":"Cancel",
								"data":{"type":"ignoreletter"},
								"callback":writingLetter
							}
						]);
			break;
		case "ignoreletter":
			addClippyOptions([]);
			this.ignoreLetter = true;
			agent.stop();
			break;
		case "inserttemplate":
			if(data["templatetype"]){
				if(data["templatetype"] == "personal"){
					insertTemplate("personal");
				} else if(data["templatetype"] == "business"){
					insertTemplate("business");
				}
			} else {
				addClippyOptions([
							{
								"name":"personalTemplate",
								"text":"Insert a personal letter template",
								"data":{"type":"inserttemplate", "templatetype":"personal"},
								"callback":writingLetter
							},
							{
								"name":"businessTemplates",
								"text":"Insert a business letter template",
								"data":{"type":"inserttemplate", "templatetype":"business"},
								"callback":writingLetter
							},
						]);
			}
			break;
		case "onlinetemplates":
			log('Online templates');
			window.open("http://www.bing.com/search?q=letter+templates&go=Submit&qs=n&form=QBLH&pq=letter+templates&sc=8-10&sp=-1&sk=&cvid=45b9636cb4b048bbbe2e1c352e381a45", '_blank');
			break;
		default:
			break;
	} 
}

function createEvent(data){
	agent.speak("Would you like me to scan for events automatically?");
	addClippyOptions([BASE_OPTION]);
}

function findLocation(data){
	agent.speak("Would you like me to scan for mentioned locations?");
	addClippyOptions([BASE_OPTION]);
}

function findAddress(data){
	if(Object.keys(data).length == 0){
		//This is the first call so we list the addresses
		var addresses = scanForAddresses(this.documentData);
		if(addresses != null)
		{
			agent.speak("These are the addresses I found.  Would you like me map the address?");
			var options = new Array();
			for(var i = 0; i < addresses.length; i++)
			{
				options[i] = {
								"name":"Address" + i,
								"text":addresses[i],
								"data":{"location":addresses[i]},
								"callback":findAddress
							}
			}
			addClippyOptions(options);
			return;
		}
		else{
			agent.speak("Sorry, I didn't find any addresses.");
		}
	}
	else {
		agent.speak("Looking for address '" + data["location"] + "'");
		addClippyOptions([BASE_OPTION]);
	}
}

function similarImages(data){
	agent.speak("Would you like me to try to find similar images to the ones in your document?");
	addClippyOptions([BASE_OPTION]);
}

function wikipedia(data){
	agent.speak("Would you like me to try and find some Wikipedia articles?");
	addClippyOptions([BASE_OPTION]);
}

function findPeople(data){
	this.clippyInAction = true;
	if(Object.keys(data).length == 0){
		agent.speak("Would you like me to try and find information about the people in your document?");
		addClippyOptions([
							{
								"name":"yes",
								"text":"Yes",
								"data":{"type":"result","result":"yes"},
								"callback":findPeople
							},
							{
								"name":"no",
								"text":"No",
								"data":{"type":"result","result":"no"},
								"callback":findPeople
							}
						]);
		return;
	}
	
	//We were the caller so we are doing letter specific stuff
	if(data["type"] == "result"){
		if(data["result"] == "yes"){
			log('Got a yes result');
			var text = documentData;
			if(text != null){
				log('Looking for famous people');
				text = text.replace(/[^a-zA-Z ]/g, '');
				text = text.split(" ");
				var famousPeople = [];
				for(var i = 0; i < text.length - 1; i++){
					var testName = text[i] + ' ' + text[i+1];
					var result = famousPerson(testName);
					if(result.length != 0){
						famousPeople.push(result);
					}
				}
				var famousOptions = [];
				for(var i = 0; i < famousPeople.length; i++){
					famousOptions.push({
						"name":famousPeople[i],
						"text":famousPeople[i],
						"data":{"type":"person","person":famousPeople[i]},
						"callback":findPeople
					});
				}
				addClippyOptions(famousOptions);
			} else {
				log('Text was null');
			}
		} else {
			addClippyOptions([]);
		}
		agent.stop();
		this.clippyInAction = false;
	} else if(data["type"] == "person"){
		log('Finding data on: ' + data["person"]);
		document.getElementById("content-div").innerHTML = getWikipediaArticle(data["person"]);
	}
}

function famousPerson(name){
	for(var i = 0; i < this.famous_people.length; i++){
		if(this.famous_people[i].toLowerCase().trim() == name.toLowerCase().trim()){
			return this.famous_people[i];
		}
	}
	return "";
}

function plagiarism(data){
	agent.speak("Would you like me to check your document for possible plagiarism?");
	addClippyOptions([BASE_OPTION]);
}



