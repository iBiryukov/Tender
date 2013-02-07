var EventEmitter = require('events').EventEmitter,
	_ = require('underscore');

module.exports = simpleStack;

function simpleStack(isUnique) {
	this.init(isUnique);
}

_.extend(simpleStack.prototype, EventEmitter.prototype, {

	constructor: simpleStack,

	stack: [],

	isUnique: false,

	init: function(isUnique) {
		this.stack.length = 0;
		this.isUnique = isUnique;
	},

	push: function(value) {
		if(this.isUnique && this.contains(value)) {
			return;
		}

		this.stack.push(value);
		this.emit("pushed", value);
	},

	pop: function() {
		if(this.stack.length === 0) throw new Error('Stack is empty');
		return this.stack.pop();
	},

	length: function() {
		return this.stack.length;
	}, 

	remove: function(value) {
		if(this.contains(value)) {
			this.stack = _.without(this.stack, value);
		}
	},

	contains: function(value) {
		return _.indexOf(this.stack, value) >= 0;
	}
});