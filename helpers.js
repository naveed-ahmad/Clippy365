function log(message){
	document.getElementById('debuglog').innerHTML = document.getElementById('debuglog').innerHTML + "<br>" + message.replace("\r\n","<br>");
}

function clearLog(){		
	document.getElementById('debuglog').innerHTML = "";
}

function insertIntoDocument(text){
	Office.context.document.setSelectedDataAsync(text, function (asyncResult) {
		var error = asyncResult.error;
		if (asyncResult.status === "failed"){
			log(error.name + ": " + error.message);
		}
	});
}

function agentSelectChange() {
	//TODO: Fix this
	log("FIX ME");
	clippy.load(document.getElementById('agentSelect').value, function(agent){
		// do anything with the loaded agent
		this.agent = agent;
		agent.show();
		populateAnimations();
	});
}

function doActivity() {
	this.agent.play(document.getElementById("activity").value);
}

function populateAgents(){
	var agents = ["Clippy","Bonzi","F1","Genie","Genius","Links","Merlin","Peedy","Rocky","Rover"];
	for(var i = 0; i < agents.length; i++){
		document.getElementById('agentSelect').innerHTML += '<option value="' + agents[i] + '">' + agents[i] + '</option>';
	}
}

function populateAnimations() {
    var activities = "";
	var animations = this.agent.animations();
	for(var i = 0; i < animations.length; i++){
		var animation = animations[i];
		activities += '<option value="' + animation + '">' + animation + '</option>';
	}
	document.getElementById('activity').innerHTML = activities
}



function processDocument(data){
	documentData = data;
	if(this.clippyInAction){
		//We are already doing something.
		return;
	}
	if(!this.ignoreLetter && isLetter(data)){
		writingLetter({"type":"writing"});
		return;
	} 
	var addresses = findAddresses(data);
	for(var i = 0; i < addresses.length; i++)
	{
		log(addresses[i]);
	}
}

// Get all of the content from a Word document in 1KB chunks of text.
function getDocumentContents() {
	this.fileData = "";
	Office.context.document.getFileAsync(Office.FileType.Text,{sliceSize: 1000}, function (asyncResult) {
		if (asyncResult.status === 'succeeded') {
			var myFile = asyncResult.value,
			state = {
				file: myFile,
				counter: 0,
				sliceCount: myFile.sliceCount
			};
			getSliceData(state);
		}
	});
}

function collateData(data,finished){
	this.fileData += data;
	if(finished){
		processDocument(this.fileData);
		this.documentRunner = setTimeout(getDocumentContents,2000);
	}
}

// Get a slice from the file, as specified by
// the counter contained in the state parameter.
function getSliceData(state) {
	state.file.getSliceAsync(
		state.counter,
		function (result) {
			var slice = result.value,
			data = slice.data;
			state.counter++;
			// Do something with the data.
			// Check to see if the final slice in the file has
			// been reached—if not, get the next slice;
			// if so, close the file.
			if (state.counter < state.sliceCount) {
				collateData(data,false);
				getSliceData(state);
			} else {
				collateData(data, true);
				closeFile(state);
			}
		}
	);
}
// Close the file when done with it.
function closeFile(state) {
	state.file.closeAsync(function (results) {
		// Inform the user that the process is complete.
	});
}

function findAddresses(text)
{
	var expression = /((?:\d{1,5}(?:\ 1\/[234])?(?:\x20[A-Z](?:[a-z])+)+)\s{1,2})([A-Z](?:[a-z])+(?:\.?)(?:\x20[A-Z](?:[a-z])+){0,2})\,\x20(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\x20((?!0{5})\d{5}(?:-\d {4})?)/gim; // /(?n:(<address1>))\s{1,2}(?i:(?<address2>(((APT|BLDG|DEPT|FL|HNGR|LOT|PIER|RM|S(LIP|PC|T(E|OP))|TRLR|UNIT)\x20\w{1,5})|(BSMT|FRNT|LBBY|LOWR|OFC|PH|REAR|SIDE|UPPR)\.?)\s{1,2})?)(<city>)\,\x20(<state>)\x20(<zipcode>))/gim;
	var matches = text.match(expression);
	if(matches == null){
		return [];
	}
	for(var i = 0; i < matches.length; i++){
		addresses.push('' + matches[i]); //Cast to string
	}
	return addresses;
}

/************************* SNOW *****************************/

var snowStarted = false;

function snowToggle(){
	if(snowStarted){
		snowStop();
	} else {
		snowStart();
	}
}

function snowStart(){
	//canvas init
	
	document.getElementById("body").style.background = '#6b92b9';	
	this.snowcanvas = document.getElementById("canvas");
	this.snowctx = snowcanvas.getContext("2d");
	
	//canvas dimensions
	this.snowW = window.innerWidth - 20;
	this.snowH = window.innerHeight - 80;
	this.snowcanvas.width = this.snowW;
	this.snowcanvas.height = this.snowH;
	
	//snowflake particles
	this.snowmp = 25; //max particles
	this.snowparticles = [];
	for(var i = 0; i < snowmp; i++)
	{
		this.snowparticles.push({
			x: Math.random()*snowW, //x-coordinate
			y: Math.random()*snowH, //y-coordinate
			r: Math.random()*4+1, //radius
			d: Math.random()*snowmp //density
		})
	}
	log('Starting snow');
	this.snowInterval = setInterval(snowDraw, 33);
	snowStarted = true;
}
	
function snowStop(){
	document.getElementById("body").style.background = '#FFF';
	clearInterval(this.snowInterval);
	this.snowcanvas.width = 0;
	this.snowcanvas.height = 0;
	this.snowStarted = false;
	log('Stopping snow');
}
//Lets draw the flakes
function snowDraw()
{
	snowctx.clearRect(0, 0, snowW, snowH);
	snowctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	snowctx.beginPath();
	for(var i = 0; i < snowmp; i++)
	{
		var p = snowparticles[i];
		snowctx.moveTo(p.x, p.y);
		snowctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
	}
	snowctx.fill();
	snowUpdate();
}

//Function to move the snowflakes
//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
var snowangle = 0;
function snowUpdate()
{
	snowangle += 0.01;
	for(var i = 0; i < snowmp; i++)
	{
		var p = snowparticles[i];
		//Updating X and Y coordinates
		//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
		//Every particle has its own density which can be used to make the downward movement different for each flake
		//Lets make it more random by adding in the radius
		p.y += Math.cos(snowangle+p.d) + 1 + p.r/2;
		p.x += Math.sin(snowangle) * 2;
		//Sending flakes back from the top when it exits
		//Lets make it a bit more organic and let flakes enter from the left and right also.
		if(p.x > snowW+5 || p.x < -5 || p.y > snowH)
		{
			if(i%3 > 0) //66.67% of the flakes
			{
				snowparticles[i] = {x: Math.random()*snowW, y: -10, r: p.r, d: p.d};
			}
			else
			{
				//If the flake is exitting from the right
				if(Math.sin(snowangle) > 0)
				{
					//Enter from the left
					snowparticles[i] = {x: -5, y: Math.random()*snowH, r: p.r, d: p.d};
				}
				else
				{
					//Enter from the right
					snowparticles[i] = {x: snowW+5, y: Math.random()*snowH, r: p.r, d: p.d};
				}
			}
		}
	}
}


/************************* SNOW *****************************/

