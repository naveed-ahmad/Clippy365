FULL_OPTIONS = [
					{
						"name":"letterWriting",
						"text":"Writing a letter",
						"callback":writingLetter
					},
					{
						"name":"createEvent",
						"text":"Create an event in my calendar",
						"callback":createEvent
					},
					{
						"name":"findLocation",
						"text":"Find information about a location",
						"callback":findLocation
					},
					{
						"name":"findAddress",
						"text":"Find an address",
						"callback":findAddress
					},
					{
						"name":"similarImages",
						"text":"Find similar images",
						"callback":similarImages
					},
					{
						"name":"wikipedia",
						"text":"Find information about on Wikipedia",
						"callback":wikipedia
					},
					{
						"name":"findPeople",
						"text":"Find information about a person",
						"callback":findPeople
					},
					{
						"name":"plagiarism",
						"text":"Check for plagiarism",
						"callback":plagiarism
					}
				];

BASE_OPTION = {"name":"unknown","text":"Placeholder text","callback":null};
	
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
			option["callback"]();
			return;
		}
	}
	log('No callback found');
}

function writingLetter(){
	agent.speak("So you are writing a letter. What would you like help with?");
	addClippyOptions([BASE_OPTION]);
}

function createEvent(){
	agent.speak("Would you like me to scan for events automatically?");
	addClippyOptions([BASE_OPTION]);
}

function findLocation(){
	agent.speak("Would you like me to scan for mentioned locations?");
	addClippyOptions([BASE_OPTION]);
}

function findAddress(){
	agent.speak("Would you like me to scan for addresses?");
	addClippyOptions([BASE_OPTION]);
}

function similarImages(){
	agent.speak("Would you like me to try to find similar images to the ones in your document?");
	addClippyOptions([BASE_OPTION]);
}

function wikipedia(){
	agent.speak("Would you like me to try and find some Wikipedia articles?");
	addClippyOptions([BASE_OPTION]);
}

function findPeople(){
	agent.speak("Would you like me to try and find information about the people in your document?");
	addClippyOptions([BASE_OPTION]);
}

function plagiarism(){
	agent.speak("Would you like me to check your document for possible plagiarism?");
	addClippyOptions([BASE_OPTION]);
}



