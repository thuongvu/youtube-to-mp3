"use strict"
var _ = require('lodash');

module.exports = (formats) => {
	let highest = _.chain(formats)
		.filter(format => {
			return format.audioBitrate !== null;
		})
		.sortBy(format => {
			return format.audioBitrate;
		})
		.last()
		.value();

	return highest ? highest : _.first(formats);
}
