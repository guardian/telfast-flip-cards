'use strict';

const $ = require('jquery');
const data = require('./components/cardData');

// vue components
const Card = require('./components/Card');

module.exports = {
	name: 'App',

	el: '#App',

	components: {
		Card
	},

	data: function () {
		return {
			cards: data,
			regions: []
		};
	},

	methods: {
		filter: function (region) {
			console.log(region);
		}
	},

	computed: {
	}
};

