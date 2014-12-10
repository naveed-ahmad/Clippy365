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
	addClippyOptions([BASE_OPTION]);
}

function findLocation(){
	addClippyOptions([BASE_OPTION]);
}

function findAddress(){
	addClippyOptions([BASE_OPTION]);
}

function similarImages(){
	addClippyOptions([BASE_OPTION]);
}

function wikipedia(){
	addClippyOptions([BASE_OPTION]);
}

function findPeople(){
	addClippyOptions([BASE_OPTION]);
}

function plagiarism(){
	addClippyOptions([BASE_OPTION]);
}



