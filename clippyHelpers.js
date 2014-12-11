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

function scanLetterForTokens(letter){
	tokens = { 	"addressee":"",
				"author":"",
				"greeting":""};
	
	parts = letter.replace("\r"," ");
	parts = parts.replace("\n"," ");
	parts = parts.replace("  "," ");
	parts = parts.split(" ");
	
	tokens["author"] = "Clippy";
	
	// Check the first word for a to
	var greeting = parts[0].toLowerCase().trim();
	if(greeting == "to" && (parts[1].toLowerCase() == "who" || parts[2].toLowerCase() == "whom")){
			//To whom it may concern....
			tokens["greeting"] = "To";
			tokens["addressee"] = "whom it may concern, ";
			return;
	} else if(greeting == "to"){
		tokens["greeting"] = "To";
	} else if(greeting == "dear"){
		tokens["greeting"] = "Dear";
	} else {
		//Don't appear to have a letter
		log('Not a letter:');
		return;
	}
	
	//Find addressee:
	//To Mr Bond, Mrs K Winslow, Dr. James Hunter

	for(var i = 1; i < parts.length; i++){
		if(parts[i].indexOf(",") > -1){ //Contains a comma
			log(parts[i]);
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
log("expressing");
	var expression = /((?:\d{1,5}(?:\ 1\/[234])?(?:\x20[A-Z](?:[a-z])+)+)\s{1,2})([A-Z](?:[a-z])+(?:\.?)(?:\x20[A-Z](?:[a-z])+){0,2})\,\x20(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\x20((?!0{5})\d{5}(?:-\d {4})?)/gim; // /(?n:(<address1>))\s{1,2}(?i:(?<address2>(((APT|BLDG|DEPT|FL|HNGR|LOT|PIER|RM|S(LIP|PC|T(E|OP))|TRLR|UNIT)\x20\w{1,5})|(BSMT|FRNT|LBBY|LOWR|OFC|PH|REAR|SIDE|UPPR)\.?)\s{1,2})?)(<city>)\,\x20(<state>)\x20(<zipcode>))/gim;
log("scanning: " + text);
	var matches = text.match(expression);
log("returning");
	return matches;
}

function insertTemplate(type,data){
	tokens = scanLetterForTokens(this.documentData);
	var letter = "";
	if(type == "personal"){
		letter = "{GREETING} {ADDRESSEE},\r\n[Write a brief introduction to what your letter is about]\r\n[Write a more detailed explaination here]\r\n[Thank them for your work]\r\nSincerely,\r\n\r\n{AUTHOR}";
	} else {
		letter = "{GREETING} {ADDRESSEE},\r\n[Write a brief introduction to what your letter is about (I have no idea what goes into a business letter so I'm pretending)]\r\n[Write a more detailed explaination here]\r\n[Thank them for your work]\r\n\r\nSincerely,\r\n\r\n{AUTHOR}";
	}
	
	log('Checking tokens');
	if(tokens["greeting"].length == 0){
		tokens["greeting"] = "Dear";
	}
	if(tokens["addressee"].length == 0){
		tokens["addressee"] = "Sir/Madam";
	}
	log('checked tokens');
	letter = letter.replace("{GREETING}",tokens["greeting"]);
	letter = letter.replace("{ADDRESSEE}",tokens["addressee"]);
	letter = letter.replace("{AUTHOR}",tokens["author"]);
	
	insertIntoDocument(letter);
}

function writingLetter(data){
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
	//log("Data length: " + data.length);
	//We were the caller so we are doing letter specific stuff
	switch(data["type"]){
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
	log("listing addresses");
		//This is the first call so we list the addresses
		var addresses = scanForAddresses(this.documentData);
	log("scanned");
		if(addresses != null)
		{
			agent.speak("These are the addresses I found.  Would you like me to scan for addresses?");
			var options = new Array();
			for(var i = 0; i < addresses.length; i++)
			{
	log("Add Option " + i);
				options[i] = {
								"name":"Address" + i,
								"text":addresses[i],
								"data":{"location":addresses[i]},
								"callback":findAddress
							}
			}
			log(options);
			addClippyOptions(options);
			return;
		}
		else{
		log("no addresses");
			agent.speak("Sorry, I didn't find any addresses.");
		}
	}
	else {
	log("looking for address");
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
	agent.speak("Would you like me to try and find information about the people in your document?");
	addClippyOptions([BASE_OPTION]);
}

function plagiarism(data){
	agent.speak("Would you like me to check your document for possible plagiarism?");
	addClippyOptions([BASE_OPTION]);
}



