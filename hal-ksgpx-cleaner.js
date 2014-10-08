﻿var lineReader = require('line-reader');
var fs = require('fs');

var output = "";
var i = 1;
var trkOpenTagFound = false;

NAMEOPENTAG = "<name>";
NAMECLOSETAG = "</name>";
TRACKOPENTAG = "<trk>";
TRACKCLOSETAG = "</trk>";

// read all lines:
lineReader.eachLine('./passit/passit_2014.gpx', function(line) {
	var nameOpenTag = line.search(NAMEOPENTAG);
	var nameCloseTag = line.search(NAMECLOSETAG);
	var trackOpenTag = line.search(TRACKOPENTAG);
	var trackCloseTag = line.search(TRACKCLOSETAG);
	
	if (trackOpenTag >= 0) {
		trkOpenTagFound = true;
	}

	// If track is not found yet, check the line content
	// If track is found then skip the line
	if (trkOpenTagFound === false) {
		if (nameOpenTag >= 0) {
			var nameOrig = line.slice(nameOpenTag + NAMEOPENTAG.length, nameCloseTag);
			var tmp = nameOrig.replace(/[,:.]/gi, "");
			var newLine = line.replace(nameOrig, tmp);
			output += newLine;
			i++;
		} else {
			output += line;
		}
	}
	// Track closed
	if ((trackCloseTag >= 0) && (trkOpenTagFound === true)) {
		trkOpenTagFound = false;
	}
}).then(function () {
	console.log("I'm done!!");
    // All lines are read, file is closed now.
	fs.writeFile('./passit/passit_2014-mod.gpx', output, function (err) {
		if (err) throw err;
		console.log('It\'s saved!');
	});
});
