"use strict"

var assert = require('assert');
var getHighestBitrate = require('../lib/getHighestBitrate');
var fixture = require('./fixtures/getHighestBitrateFixture.js');

describe('getHighestBitrate should', () => {
	it('return the format object with the highest bitrate', () => {
		assert.deepEqual({ audioEncoding: 'aac', audioBitrate: 256 },  getHighestBitrate(fixture.withBitrates.formats))
	});
	it('return the a format object when fields are null', () => {
		assert.deepEqual({ audioEncoding: null, audioBitrate: null },  getHighestBitrate(fixture.withoutBitrates.formats))
	});
})
