/*
XMLHttpRequest:
https://en.wikipedia.org/wiki/XMLHttpRequest

CouchDB:
http://guide.couchdb.org/draft/tour.html
https://wiki.apache.org/couchdb/HTTP_Document_API
http://docs.couchdb.org/en/1.6.1/config/intro.html
http://docs.couchdb.org/en/1.6.1/config/http.html#cross-origin-resource-sharing
http://docs.couchdb.org/en/1.6.1/intro/curl.html

HTML(5):
http://www.w3schools.com/html/default.asp
http://www.w3schools.com/jsref/default.asp

CouchDB configuration (Mac OS X):
~/Library/Application Support/CouchDB/etc/couchdb/local.ini
/Applications/Apache CouchDB.app/Contents/Resources/couchdbx-core/etc/couchdb/local.ini
CouchDB configuration (Windows):
C:\Program Files (x86)\Apache Software Foundation\CouchDB\etc\couchdb\local.ini
start/stop/restart: Control Panel --> Services --> Apache CouchDB

[httpd]
enable_cors = true
bind_address = 0.0.0.0  <-- for access from other devices, 127.0.0.1: local device only
...

[cors]
origins = *

*/

var request = new XMLHttpRequest();

request.onreadystatechange = function() {
	// console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
	// console.log(request.responseText);
	if (request.readyState == 4) {
		if (request.status == 200) {
			var response = JSON.parse(request.responseText);
			handlers[response._id](response);
		}
		if (request.status == 404) {
			console.log("not found: " + request.responseText);
		}
	}
};

function get(variable) {
	// console.log("get " + variable);
	request.open("GET", dburl + variable, false);
	request.send();
}

function update() {
	for (var name in handlers) {
		// console.log("updating " + name);
		get(name);
	}
}

// request updates with a fixed interval (ms)
var intervalID = setInterval(update, 20000);

///////////////////////////////////////////////////////////////////////////////
// your code below

var dbname = "hci1";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";
var handlers = {
	"animal" : updateAnimal,
	"showCounter" : showCounter,
	"counter" : updateCounter,
	"mytext" : updateText,
	// add further handlers here
};

function updateAnimal(response) {
	document.getElementById(response._id).src = response.src;
	document.getElementById(response._id).width = response.width;
}

function updateCounter(response) {
	document.getElementById(response._id).innerHTML =
		showCounter ? response.value : "";
}

var showCounter = true;

function showCounter(response) {
	showCounter = response.checked;
}

function updateText(response) {
	document.getElementsById("mytext").innerHTML = response.value;
}




function hideAll() {
	$('.screen').hide();
}
function showOnly(screen) {
	hideAll();
	show(screen);
}
function hide(screen) {
	document.getElementById(screen).style.display = 'none';
}
function show(screen) {
	document.getElementById(screen).style.display = 'block';
}

function replaceContent(identifier, content) {
	console.log(identifier);
	console.log(content);

	$(identifier).html(content);
}

function incNumber(element) {
	$(element).val(parseInt($(element).val()) + 1);
}
function decNumber(element) {
	$(element).val(parseInt($(element).val()) - 1);
}


function submitBookingStep1() {

	replaceContent('.js-from', $('#from').val());
	replaceContent('.js-to', $('#to').val());
	replaceContent('.js-date', $('#date').val());
	replaceContent('.js-time', $('#time').val());


	// AB is checked
	if ($("#ab").is(':checked')) {
		replaceContent('.js-ab', $('#time').val());

		var theTimeArr =  $('#time').val().split(":");
		var theTime = parseInt(theTimeArr[0]);
		theTime += 2;

		replaceContent('.js-an', theTime + ':' + theTimeArr[1]);

	} else {
		replaceContent('.js-an', $('#time').val());

		var theTimeArr =  $('#time').val().split(":");
		var theTime = parseInt(theTimeArr[0]);
		theTime -= 2;

		replaceContent('.js-ab', theTime + ':' + theTimeArr[1]);
	} 

	replaceContent('.js-duration', Math.abs(theTime - theTimeArr[0]) + ' Stunden');

	showOnly('booking-step-3');
}

function submitBookingStep4() {
	alert('Vielen Dank für Ihre Bestellung!');

	show('indicator-long');
	hide('indicator-short');
	hide('indicator-arrived');

	// cycle through indicators
	setTimeout(function() {
		hide('indicator-long');
		show('indicator-short');
	}, 3000);	
	setTimeout(function() {
		hide('indicator-short');
		show('indicator-arrived');
	}, 6000);
	setTimeout(function() {
		hide('indicator-arrived');
	}, 9000);

	showOnly('dashboard')	
}