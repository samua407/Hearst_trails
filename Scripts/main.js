var xhr = new XMLHttpRequest();
xhr.open('HEAD', 'http://www.goodhousekeeping.co.uk/cm/goodhousekeepinguk/images/bB/proper-beef-stew-111013-de-md.jpg', true);
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		if (xhr.status == 200) {
			console.log('Size in bytes: ' + xhr.getResponseHeader('Content-Length'));
		} else {
			console.log('ERROR');
		}
	}
};
xhr.send(null);


/*
*****************************************
THIS NEEDS A NAME
REST services data model
*/

// main objects 

var core = {

	hearstAPI: "http://hearst.api.mashery.com/Article/search?",
	hearstKey: "tru42eq8jjd6668ezayurxz3"
}

var trail = {

	trailID: "ABC123",
	steps: [],
	/* NOT YET IN USE, WILL LET US FORK THE TRAILS
	_isFork: false,
	_parent: "ABC122",
	_forks: [],
	*/

};

var trailExtended = {

	currentTag: "NoTag",
	currentHead: 0,
	DrawArticles: [],
	Articles: [],

};

// objects updaters 

function evaluateCurrentTag() {

	var trailSize = trail.steps.length;

	if (trailSize === 0) {
		console.log("undefined");
		trailExtended.currentTag = "NoTag";
	} else {
		console.log(trailSize);
		trailExtended.currentTag = trail.steps[trailSize - 1].tag;
	};
};


function evaluateCurrentDraw() {

	//this will delete array elements of the currentDraw, it will not reemplace the object so we can keep the binding alive

}

// child object contructors 

function step(tag, img) {
	this.tag = tag;
	this.img = img;
	if (typeof img != "string") this.img = "../Images/stepDefault.png"; // in case img is not a url

};

function article(title, img, tags, exerpt, publication, url) {

	this.title = title;
	this.img = img
	if (typeof img != "string") this.img = "../Images/ArtcileDefault.png"; // in case img is not a url
	this.tags = tags;
	this.exerpt = exerpt;
	this.publication = publication;
	this.url = url;

};

// REST CALL

function call(keyword, publication, size, start) {

	this._key = core.hearstKey;
	this._pretty = 0;
	this.shape = "brief";
	this.pages = "full";
	this.sort = "publish_date,desc";

	this.start = start;
	this.limit = size;

	if (typeof keyword != "undefined" && typeof keyword == "string") {
		this.keywords = keyword;
		//this.total = 1;
	};
	if (typeof publication != "undefined") {
		this.site_id = publication;
	};
	if (typeof start === "undefined") {
		this.start = 0;
	};
	if (typeof size === "undefined") {
		this.limit = 5;
	};

};


var currentCall = new call();
console.log(currentCall);

function retriveArticles(Call) {
	$.ajax({
		type: 'GET',
		crossDomain: true,
		jsonp: false,
		jsonpCallback: "rawResponse_" + trail.trailID,
		cache: true,
		jsonp: '_callback',
		dataType: "jsonp",
		global: true,
		url: core.hearstAPI,
		data: Call,


		beforeSend: function() {
			// this is where we append a loading image
			console.log("before");
		},
		success: function(data) {
			// successful request; do something with the data
			console.log(data);
			console.log("succes");
			console.log("ready to construct the childs");

		},
		error: function() {
			// failed request; give feedback to user
			console.log("error");
		},
		complete: function() {
			console.log("ready to evaluate the main objects");


		},

	});
};


//var x = new article(title, img, tags, exerpt, publication, url);
//var y = new step(tag, img);
//evaluateCurrentTag();
retriveArticles(currentCall);