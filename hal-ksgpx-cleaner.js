var fs = require('fs')

var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('./passit/passit_20131118-wo-track.gpx');
var output = "";
var i = 1;
OPENTAG = "<name>";
CLOSETAG = "</name>";

lr.on('error', function (err) {
    // 'err' contains error object
});

lr.on('line', function (line) {
	var nameOpenTag = line.search(OPENTAG) + OPENTAG.length;
	var nameCloseTag = line.search(CLOSETAG);
    if (nameOpenTag > OPENTAG.length) {
		var nameOrig = line.slice(nameOpenTag, nameCloseTag);
		var tmp = nameOrig.replace(/[,:.]/gi, "");
		var newLine = line.replace(nameOrig, tmp);
		//output += i + " löytyi " + line + " -> " + newLine + "\r\n";
		output += newLine  + "\r\n";
		i++;
	} else {
		output += line + "\r\n";
	}
});

lr.on('end', function () {
    // All lines are read, file is closed now.
	fs.writeFile('./passit/passit_20131118-wo-track-mod.gpx', output, function (err) {
		if (err) throw err;
		console.log('It\'s saved!');
	});
});
