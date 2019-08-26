# Javascript Noise Machine

[Demo Here](https://sjmduncan.github.io/noise/index.html).

Once upon a time I used [ChromaDoze](https://github.com/pmarks-net/chromadoze) for all of my coloured noise needs.
Then Android and I parted ways and to date nothing has come close to ChromaDoze for ASMR/sleep/focus/generally drowning out distracing noises with noise that suits my tastes which is also not just a pre-recorded loop.

This is my current solution: a basic Javascript procedural noise machine with adjustable lowpass shaping (`WHITENESS`), sinusoidal volume modulation (`PULSE`), and most importantly iOS background playback (via (ab)use of the `<audio>` tag).

## How

1. Generate white noise buffer, apply sinusoidal amplituded modulation if `PULSE` is enabled. Re-generate the buffer when `PULSE` is enabled/disabled/modified
2. Pass buffer to `AudioBufferSourceNode`
3. Connect `AudioBufferSourceNode` to `BiquadFilterNode`
4. Connect `BiquadFilterNode` to the `AudioDestinationNode` of the window `AudioContext`
5. Sync the `AudioContext` play state (`suspend/resume`) with that of an `<audio>` element which just infinitely loops a short silent `.wav` file, otherwise mobile browsers will kill playback whenever the browser is not in the foreground (note that pause via the audio control menu will work because it simply kills all audio playback when the `<audio>` element is paused. Play/resume (most likely) won't work because Javascript execution is not allowed for background browsers/tabs, at least in Safari/iOS).

The noise buffer is up to 30 seconds long, and the actual length may be shorter (down to about 25 seconds) depending on the minimum exact multiple of of the `PULSE` period (in sample counts) which fits in the 30 second buffer (to ensure seamless looping).
If `PULSE` is disabled then it's just 30 seconds of plain old white noise.

For `PULSE` to work under Safari/iOS the first buffer used by the `AudioBufferSourceNode` must be the maximum length of any future buffer, and future buffers which are bigger will be truncated to the size of the first initialization buffer and the loop will not be seamless.
Desktop browsers are okay with buffer size growing after initialization (at least Chrome/Firefox are).

`PULSE` period starts at 0.2Hz to 10Hz (so you can do theta waves but not binaural ones, sorry), and the slider adjustment is log-scaled.

`WHITENESS` starts at 1 (lowpass cutoff=100Hz) and goes to 11 (lowpass cutoff=1.5kHz), because whiter than 11 is too white for even my pasty tastes. 