# Javascript Noise Machine

[Demo Here](https://sjmduncan.github.io/noise/index.html).

Once upon a time I used [ChromaDoze](https://github.com/pmarks-net/chromadoze) for all of my coloured noise needs.
Then Android and I parted ways and haven't found a replacement noise machine. 

This is my current replacement: a basic Javascript procedural noise machine with adjustable lowpass shaping (`whiteness`), sinusoidal volume modulation (`PULSE`), and most importantly background playback in iOS via (ab)use of the `<audio>` tag.


## How

1. Generate white noise buffer, apply sinusoidal amplituded modulation if `PULSE` is enabled. Re-generate the buffer when `PULSE` is enabled/disabled/modified
2. Pass buffer to `AudioBufferSourceNode`
3. Connect `AudioBufferSourceNode` to `BiquadFilterNode`
4. Connect `BiquadFilterNode` to the `AudioDestinationNode` of the window AudioContext
5. Sync the `AudioContext` play state (`suspend/resume`) with that of an `<audio>` element which just infinitely loops a short silent `.wav` file, otherwise mobile browsers will kill playback when you use other apps or lock the screen
    1. Note that pause from the mobile UI will work but play/resume (probably) won't because Javascript execution is not allowed for background apps/browser tabs (at least under iOS), so play state sync will break once paused.

The noise buffer is up to 30 seconds long, and the actual length varies depending on the maximum exact multiple (in sample counts) of the `PULSE` period which fits in the 30 second buffer (if `PULSE` is enabled, otherwise it's just 30 seconds of white noise).
The initial `AudioBufferSource` has to be passed a full 30 second buffer because Safari (at least under iOS) doesn't like it when buffer sizes get bigger later (desktop firefox/chrome seem okay with that though).
`PULSE` period starts at 0.2Hz to 5Hz (so you can do theta waves but not binaural ones, sorry), and is adjustable on a log scale.
Whiteness ranges starts at 1 (lowpass cutoff=100Hz) and goes to 11 (lowpass cutoff=1.5kHz), because above that is too white for my personal taste.