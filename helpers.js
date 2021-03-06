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
	document.getElementById('clippy').parentNode.removeChild(document.getElementById('clippy'));
	document.getElementById('clippy-balloon').parentNode.removeChild(document.getElementById('clippy-balloon'));
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


function handleMouseMove(event) {
	var dot, eventDoc, doc, body, pageX, pageY;

	event = event || window.event; // IE-ism

	// If pageX/Y aren't available and clientX/Y are,
	// calculate pageX/Y - logic taken from jQuery.
	// (This is to support old IE)
	if (event.pageX == null && event.clientX != null) {
		eventDoc = (event.target && event.target.ownerDocument) || document;
		doc = eventDoc.documentElement;
		body = eventDoc.body;

		event.pageX = event.clientX +
		  (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
		  (doc && doc.clientLeft || body && body.clientLeft || 0);
		event.pageY = event.clientY +
		  (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
		  (doc && doc.clientTop  || body && body.clientTop  || 0 );
	}
	window.mouseX = event.pageX;
	window.mouseY = event.pageY;
	// Use event.pageX / event.pageY here
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
	this.snowctx = snowcanvas.getContext("2d");
	
	//canvas dimensions
	this.snowW = window.innerWidth - 0;
	this.snowH = window.innerHeight - 0;
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
	this.snowcanvas.width = 0;
	this.snowcanvas.height = 0;
	this.snowStarted = false;
	if(this.snowInterval){
		clearInterval(this.snowInterval);
	}
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
function gotoMap(location)
{
	w=800 
	h=600 
	if (window.screen) { 
		 w = window.screen.availWidth; 
		 h = window.screen.availHeight; 
	} 
	window.open('http://www.bing.com/maps/default.aspx?where1=' + location,'newwin','width='+w+',height='+h+',top=0,left=0'); 
}

