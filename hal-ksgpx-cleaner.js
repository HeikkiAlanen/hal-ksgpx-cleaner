var fs = require('fs')

var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('./passit/passit_20131118.gpx');
var output = "";
var i = 1;
var trkOpenTagFound = false;

NAMEOPENTAG = "<name>";
NAMECLOSETAG = "</name>";
TRACKOPENTAG = "<trk>";
TRACKCLOSETAG = "</trk>";

lr.on('error', function (err) {
    // 'err' contains error object
});

lr.on('line', function (line) {
	var nameOpenTag = line.search(NAMEOPENTAG);
	var nameCloseTag = line.search(NAMECLOSETAG);
	var trackOpenTag = line.search(TRACKOPENTAG);
	var trackCloseTag = line.search(TRACKCLOSETAG);
	
	//console.log(nameOpenTag + " " + nameCloseTag + " " + trackOpenTag + "\r\n");
	
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
			//output += i + " löytyi " + line + " -> " + newLine + "\r\n";
			//console.log(newLine + "\r\n");
			output += newLine  + "\r\n";
			i++;
		} else {
			output += line + "\r\n";
		}
	}
	// Track closed
	if ((trackCloseTag >= 0) && (trkOpenTagFound === true)) {
		trkOpenTagFound = false;
	}
});

lr.on('end', function () {
    // All lines are read, file is closed now.
	fs.writeFile('./passit/passit_20131118-mod.gpx', output, function (err) {
		if (err) throw err;
		console.log('It\'s saved!');
	});
});
