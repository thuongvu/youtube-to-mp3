# youtube-to-mp3

A command-line tool that converts a youtube video to an mp3 file using node streams.

## Installation

Make sure you have [ffmpeg](https://www.ffmpeg.org/) installed.

In your command line, run `npm -g install yttomp3` to install this package's dependencies.

## Usage

In your command line, run:

```
yttomp3 https://www.youtube.com/watch?v=D4azMok_WF8 > song.mp3
```

This will download the youtube video at the specified url, convert it to an mp3, and place it on your hard drive with the name `song.mp3`.

## Tests
```
npm test
```

## License
MIT
