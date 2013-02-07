var EE = require('events').EventEmitter;
	Stack = require('./simple_stack'),
	http = require('http'),
	$ = require('jquery'),
	request = require('request'),
	require('./globals'),
	urlParser = require('url'),
	_ = require('underscore'),
	mongoose = require('mongoose');

console.logWithTime("Starting the grabber");

mongoose.connect('localhost', 'zak');

var urlPrefix = 'http://www.zakupki.gov.ru';
var listUrl = urlPrefix + '/pgz/public/action/search/simple/result?index=:pageNum&sortField=lastEventDate&descending=true&tabName=AP&lotView=false&';

// List of page numbers that were processed (for the first stack)
var processedPages = [];
var tenderListStack = new Stack(true);
var tenderDetailStack = new Stack(true);

var maxRetries = 5;
var urlRetries = {};

var i = 0;
// When a list 'List Of Tenders' url gets pushed
tenderListStack.on('pushed', function(url){

	if(i == 1)return;
	++i;
	
	console.logWithTime('Fetching URL: "%s"', url);
	
	getHtml(url, function(error, response, body){

		if(error) {
			console.logWithTime("Error - tender list: %s", error.message);
			retryUrl(tenderListStack, url);
		} else if(response.statusCode !== 200) {
			console.logWithTime("Error - tender list: Status Code: %d, URL: %s", response.statusCode, url);
			retryUrl(tenderListStack, url);
		} else {
			console.logWithTime('Fetched URL: %s', url);
			
			// Record the processed page
			processedPages.push(url);

			// Add unprocessed pages to the queue
			$(body).find('td.iceDatPgrCol').each(function(){
				var pageId = parseInt($(this).text());
				var newUrl = listUrl.replace(':pageNum', pageId);
				tenderListStack.push(newUrl);
			});

			// Add detailed pages to the queue
			$(body).find('tr.searchResultTableRow').each(function(){
				var url = urlPrefix + $(this).find('a.iceOutLnk').attr('href');
				tenderDetailStack.push(url);
			});
		}
	});
});

tenderDetailStack.on('pushed', function(url){
	
});

tenderListStack.push('http://localhost/zakupki.html?id=1&name=2');
//tenderListStack.push(listUrl.replace(':pageNum', 1));


function getHtml(url, callback) {
	var options = {
		url: url,
		headers: {
			'user-agent': 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/6.0'
		}
	};

	request(options, callback);
}


function retryUrl(stack, url) {
	if(!(url in urlRetries)) {
		urlRetries[url] = 0;
	}

	if(urlRetries[url] < maxRetries) {
		stack.remove(url);
		stack.push(url);
		++urlRetries[url];
		console.logWithTime('Adding (%s) onto stack for retry (%d)', url, urlRetries[url]);
	}
			
}
