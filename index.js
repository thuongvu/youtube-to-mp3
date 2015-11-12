"use strict"

var url = process.argv[2];

var fs = require('fs');
var ytdl = require('ytdl-core');
var _ = require('lodash');
var ffmpeg = require('fluent-ffmpeg');
var ProgressBar = require('progress');


var getHighestBitrate = (formats) => {
	let highest = _.chain(formats)
		.filter(format => {
			return format.audioBitrate !== null;
		})
		.sortBy(format => {
			return format.audioBitrate;
		})
		.last()
		.value();

	if (highest) {
		return highest;
	} else {
		return _.first(formats);
	}
}

var encodeMusicFile = (stream, bitrate, fileName) => {
	if (!bitrate) {
		bitrate = 128;
	}
	return ffmpeg(stream)
		.noVideo()
		.audioCodec('libmp3lame')
		.audioBitrate(bitrate)
		.format('mp3')
		.on('error', (err) => console.error(err))
		.on('end', () => console.log(`Finished encoding ${fileName}.mp3`))
		.pipe(fs.createWriteStream(`${fileName}.mp3`), {
		end: true
	});
}

var createProgressBar = (stream) => {
	let bar;

	stream.on('response', (res) => {
		bar = new ProgressBar('Downloaded :percent: [:bar] Elapsed: :elapsed  ETA: :etas', {
		complete: '=',
		incomplete: ' ',
		width: 30,
		total: parseInt(res.headers['content-length'], 10)
	});

	stream.on('data', (data) => {
		bar.tick(data.length)
	});
}

ytdl.getInfo(url, (err, info) => {
	if (err) throw err;
	let readableStream = ytdl.downloadFromInfo(info, format);
	encodeMusicFile(readableStream, format.audioBitrate, info.title);
	createProgressBar(readableStream);
});
