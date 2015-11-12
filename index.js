"use strict"

var fs = require('fs');
var ytdl = require('ytdl-core');
var _ = require('lodash');
var ffmpeg = require('fluent-ffmpeg');
var ProgressBar = require('progress');

var getHighestBitrate = function(formats) {
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

ytdl.getInfo('https://www.youtube.com/watch?v=e-ORhEE9VVg', (err, info) => {
	if (err) throw err;
	let format = getHighestBitrate(info.formats);
	let readableStream = ytdl.downloadFromInfo(info, format);
	let bar;
	readableStream.on('response', (res) => {
		bar = new ProgressBar('Downloaded :percent: [:bar] Elapsed: :elapsed  ETA: :etas', {
			    complete: '=',
			    incomplete: ' ',
			    width: 30,
			    total: parseInt(res.headers['content-length'], 10)
			  });
	});

	readableStream.on('data', (data) => {
		bar.tick(data.length)
	})

	let bitrate = format.audioBitrate || 128;
	encodeFile(readableStream, bitrate, info.title);
});

var encodeFile = (stream, bitrate, fileName) => {
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