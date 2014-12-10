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

clippyProcessInformation = 	{};
	
function resetClippyProcessInformation(){
	clippyProcessInformation = {	
								"parent":"",
								"data":{},
							};
}
function addClippyOptions(options){
	document.getElementById('clippy-buttons').innerHTML = "";
	this.currentClippyOptions = options;
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
	} else {
		log("Selected Value: " + selectedValue);
	}
	
	for(var i = 0; i < this.currentClippyOptions.length; i++){
		var option = this.currentClippyOptions[i];
		if(option["name"] == selectedValue){
			log('Calling callback');
			option["callback"](option["data"]);
			return;
		}
	}
	log('No callback found');
}

function writingLetter(data){
	if(Object.keys(data).length == 0){
		//This is the first call so we present the initial options
		agent.speak("So you are writing a letter. What would you like help with?");
		clippyProcessInformation["parent"] = "writingLetter";
		clippyProcessInformation["data"] = {"helptype":"letteroptions"};
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
	//log("Data length: " + data.length);
	//We were the caller so we are doing letter specific stuff
	switch(data["type"]){
		case "inserttemplate":
			log('Insert template');
			break;
		case "onlinetemplates":
			log('Online templates');
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
	agent.speak("Would you like me to scan for addresses?");
	addClippyOptions([BASE_OPTION]);
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
	agent.speak("Would you like me to try and find information about the people in your document?");
	addClippyOptions([BASE_OPTION]);
}

function plagiarism(data){
	agent.speak("Would you like me to check your document for possible plagiarism?");
	addClippyOptions([BASE_OPTION]);
}



