/*
*****************************************
THIS NEEDS A NAME
REST services data model
*/

// main objects 

var core = {

	hearstAPI: "http://hearst.api.mashery.com/Article/search?",
	hearstKey: "tru42eq8jjd6668ezayurxz3" //this should be encrypted and retrieved from our server just before the ajax call
}

var trail = {

	trailID: "ABC123",
	steps: [ ],
	//step(tag, img)

	/* NOT YET IN USE, WILL LET US FORK THE TRAILS
	_isFork: false,
	_parent: "ABC122",
	_forks: [],
	*/

};

var trailExtended = {

	currentTag: "NoTag",
	currentHead: 0,
	hasReachedEnd: false,
	Articles_maxSize: 1000,
	DrawArticles: [ ],
	Articles: [ ],

};

// objects updater 

function evaluateCurrentTag( ) {

	var trailSize = trail.steps.length;

	if ( trailSize === 0 ) {
		console.log( "undefined" );
		trailExtended.currentTag = "NoTag";
	} else {
		console.log( trailSize );
		trailExtended.currentTag = trail.steps[ trailSize - 1 ].tag;
	};
};


function evaluateCurrentDraw( ) {


	//this will delete and add array elements of the currentDraw, it will not replace the object so we can keep the binding alive


};


function purgeDuplicates( ArticlesArray ) {
	console.log( "purging" );
	for ( var i = 0; i < ArticlesArray.Articles.length; i++ ) {
		for ( var j = i + 1; j < ArticlesArray.Articles.length; j++ ) {
			// console.log("checking for index " + i + " in an array of " + ArticlesArray.Articles.length + " starting from " + j);
			if ( ArticlesArray.Articles[ i ].id == ArticlesArray.Articles[ j ].id ) {
				// console.log("duplicate " + ArticlesArray.Articles[i].id + " " + i + " = " + ArticlesArray.Articles[j].id + " " + j);
				ArticlesArray.Articles.splice( j, 1 );
			};
		};

	};
};


// child object constructors 

function step( tag, img ) {
	if ( typeof tag != "undefined" && typeof tag == "string" ) this.tag = tag;
	this.img = img;
	if ( typeof img != "string" ) this.img = "../Images/stepDefault.png"; // in case img is not a url

};

function article( title, img, img_lrg, tags, excerpt, publication, url, type, id ) {

	this.title = title;
	this.img = img
	if ( typeof img != "string" ) this.img = "../Images/ArticleDefault.png"; // in case img is not a url
	this.img_lrg = img_lrg
	if ( typeof img_lrg != "string" ) this.img_lrg = "../Images/ArticleDefault.png"; // in case img is not a url
	this.tags = tags;
	this.excerpt = excerpt;
	this.publication = publication;
	this.url = url;
	this.type = type;
	this.id = id;


};


function call( keyword, publication, size ) {

	this._key = core.hearstKey;
	this._pretty = 0;
	this.shape = "brief";
	this.pages = "full";
	this.sort = "publish_date,desc";
	this.limit = size;
	this.start = 0;


	if ( typeof keyword != "undefined" && typeof keyword == "string" ) {
		this.keywords = keyword;
		//this.total = 1;
	};
	if ( typeof publication != "undefined" ) {
		this.site_id = publication;
	};

	if ( typeof size === "undefined" ) {
		this.limit = 10;
	};

};

// REST CALL


function FetchArticles( Call ) {
	//change the current tag to the new tag 
	// 
	if ( trailExtended.currentTag != Call.keywords ) {
		console.log( "new" )
		trailExtended.currentHead = Call.start;
		trailExtended.currentTag = Call.keywords;
		trailExtended.hasReachedEnd = false;
	} else {
		Call.start = trailExtended.currentHead;
	};

	if ( trailExtended.hasReachedEnd == true ) {
		console.log( "we have the reached end of the archive.... WOW" )
		return;
	};

	console.log( Call );
	$.ajax( {
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


		beforeSend: function ( ) {
			// this is where we append a loading image
			console.log( "before" );
		},
		success: function ( data ) {
			console.log( "success" );
			console.log( data.items );

			// successful request; do something with the data
			// update the head
			if ( data.items.length == 0 ) {
				trailExtended.hasReachedEnd = true;
			}
			trailExtended.currentHead += data.items.length;

			// construct the children 

			console.log( "ready to construct the children" );
			for ( var i = data.items.length - 1; i >= 0; i-- ) {

				var title = data.items[ i ].title;
				var tags = data.items[ i ].keywords.split( ', ' );
				var excerpt = data.items[ i ].teaser;
				var publication = data.items[ i ].origin_site_name;
				var url = data.items[ i ].canonical_url;
				var type = data.items[ i ].article_type_id;
				var id = data.items[ i ].id;

				excerpt = excerpt.replace( /<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, "" );

				//getting the article image with fallbacks 

				var img = data.items[ i ].pages[ 0 ].IMAGE_1_medium_url;
				if ( typeof img != "string" ) {
					// console.log("fall back to IMAGE_1_medium_new_url");
					img = data.items[ i ].pages[ 0 ].IMAGE_1_medium_new_url;
				};
				if ( typeof img != "string" ) {
					// console.log("fall back to IMAGE_1_url");
					// console.log(data.items[i]);
					img = data.items[ i ].pages[ 0 ].IMAGE_1_url;
				};
				if ( typeof img != "string" ) {
					// console.log("fall back to IMAGE_1_new_url");
					// img = data.items[i].pages[0].IMAGE_1_new_url;
				};

				if ( typeof img != "string" ) {
					// console.log("skiping article");
					// console.log(data.items[i]);
					continue;
				};

				//getting the article image for modal view with fallbacks 

				var img_lrg = data.items[ i ].pages[ 0 ].IMAGE_1_url;
				if ( typeof img_lrg != "string" ) {
					// console.log("fall back to IMAGE_1_url");
					// console.log(data.items[i]);
					img_lrg = data.items[ i ].pages[ 0 ].IMAGE_1_url;
				};
				if ( typeof img_lrg != "string" ) {
					// console.log("fall back to IMAGE_1_new_url");
					img_lrg = data.items[ i ].pages[ 0 ].IMAGE_1_new_url;
				};

				if ( typeof img_lrg != "string" ) {
					// console.log("skiping article");
					// console.log(data.items[i]);
					continue;
				};

				var tmpart = new article( title, img, img_lrg, tags, excerpt, publication, url, type, id );


				trailExtended.Articles.push( tmpart );


			};

		},
		error: function ( ) {
			// failed request; give feedback to user
			console.log( "error" );
		},
		complete: function ( ) {
			console.log( "evaluating main objects" );

			// first clear the extended Articles from duplicates 
			purgeDuplicates( trailExtended );

			// filter and add the tagged 

			//debug 
			$( "body" ).empty( );
			for ( var i = trailExtended.Articles.length - 1; i >= 0; i-- ) {
				$( "<img src = " + trailExtended.Articles[ i ].img + " height=" +
					300 + " />" ).appendTo( "body" );

			};
		},

	} );
};

var currentCall = new call( "nasa" );
//evaluateCurrentTag();
FetchArticles( currentCall );


/// touch and retrieve the size 
// var xhr = new XMLHttpRequest();
// xhr.open('HEAD', 'http://www.goodhousekeeping.co.uk/cm/goodhousekeepinguk/images/bB/proper-beef-stew-111013-de-md.jpg', true);
// xhr.onreadystatechange = function() {
// 	if (xhr.readyState == 4) {
// 		if (xhr.status == 200) {
// 			console.log('Size in bytes: ' + xhr.getResponseHeader('Content-Length'));
// 		} else {
// 			console.log('ERROR');
// 		}
// 	}
// };
// xhr.send(null);