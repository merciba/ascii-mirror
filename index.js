var fs = require('fs')
var path = require('path')
var jpeg = require('jpeg-js')
var asciiPixels = require('ascii-pixels')
var spawn = require('child_process').spawn
var chalk = require('chalk')
var colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray']
var colorizers = {};

colors.map(function (color) {
	colorizers[color] = function (match) {
		return chalk[color](match)
	}
})

var paint = function (frame) {
// Add custom colors for characters here
//	frame = frame.replace(/\./g, colorizers.cyan)
//	frame = frame.replace(/,/g, colorizers.green)
//	frame = frame.replace(/;/g, colorizers.yellow)
//	frame = frame.replace(/:/g, colorizers.red)
	return frame
}

var getFrame = function () {
	fs.readFile(path.join(__dirname, 'mirror.jpg'), function (err, buffer) {
		var frame = asciiPixels(jpeg.decode(buffer))
		console.log('\033c', paint(frame))
	})
}

var cycle = function () {
	getFrame()
	var getSnapshot = spawn('/opt/vc/bin/raspistill', [
		'--output', 
		'/home/pi/ascii-mirror/mirror.jpg', 
		'--quality', '50',
		'--width', '225', 
		'--height', '115', 
		'--rotation',  '270', 
		'--nopreview', 
		'--timeout', '1', 
		'--imxfx', 'negative', 
		'--brightness', '75', 
		'--contrast', '30',
		'--hflip'
	])
	getSnapshot.on('close', cycle)
}

cycle()

console.log(chalk.red("Starting mirror..."))
