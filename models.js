var mongoose = require('mongoose');

var TenderSchema = new mongoose.Schema({
	tenderId: Number,
	url: String,
	title: String,
	orderBy: String,
	price: Number,
	publishedOn: Date,
	checkDates: 

});