"use strict"

var url = process.argv[2];

var fs = require('fs');
var ytdl = require('ytdl-core');
var _ = require('lodash');
var ffmpeg = require('fluent-ffmpeg');
var ProgressBar = require('progress');
var getHighestBitrate = require('./lib/getHighestBitrate');

var encodeMusicFile = (stream, bitrate) => {
	if (!bitrate) {
		bitrate = 128;
	}
	return ffmpeg(stream)
		.noVideo()
		.audioCodec('libmp3lame')
		.audioBitrate(bitrate)
		.format('mp3')
		.on('error', (err) => console.error(err))
		.on('end', () => console.log('Finished encoding!'))
}

var createProgressBar = (stream) => {
	let bar;

	stream.on('response', (res) => {
		bar = new ProgressBar('Downloaded :percent: [:bar] Elapsed: :elapsed  ETA: :etas', {
			complete: '=',
			incomplete: ' ',
			width: 30,
			total: parseInt(res.headers['content-length'], 10)
		})
	});

	stream.on('data', (data) => {
		bar.tick(data.length)
	});
}

module.exports = ytdl.getInfo(url, (err, info) => {
	if (err) throw err;
	let format = getHighestBitrate(info.formats);
	let readableStream = ytdl.downloadFromInfo(info, format);

	createProgressBar(readableStream);
	encodeMusicFile(readableStream, format.audioBitrate)
		.pipe(process.stdout);
});
