// Log something and prepend time to it
console.logWithTime = function() {
	arguments[0] = (new Date()).toString() + ": " + arguments[0];
	return console.log.apply(this, arguments);
}