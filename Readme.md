# Javascript Noise Machine

[Demo Here](https://sjmduncan.github.io/noise/index.html).

Once upon a time I used [ChromaDoze](https://github.com/pmarks-net/chromadoze) for all of my coloured noise needs.
Then Android and I parted ways, and to date nothing has come close to ChromaDoze for ASMR/sleep/focus/generally drowning out distractions with noise tailored exactly to my tastes.

This is my current solution: a simple procedural noise machine with adjustable lowpass shaping (`WHITENESS`), sinusoidal volume modulation (`PULSE`), and most importantly iOS background playback via (ab)use of the `<audio>` tag.

## How

1. Generate white noise buffer, with sinusoidal amplituded modulation if `PULSE` is enabled
2. Pass buffer to `AudioBufferSourceNode`
3. Connect `AudioBufferSourceNode` to `BiquadFilterNode`
4. Connect `BiquadFilterNode` to the `AudioDestinationNode` of the default `AudioContext`
5. Sync the `AudioContext` play state (`suspend/resume`) with that of an `<audio>` element which loops a short silent `.wav` file
   
The last bit is to trick iOS (and other mobile browsers?) into letting a non `<audio>` sound source play in the background, otherwise as soon as you switch apps or lock the screen the sound stops.
Pausing from the mobile audio menu will kill playback and play/resume (most likely) won't start it again because Javascript execution is not allowed for background browsers/tabs (at least in Safari/iOS).

The noise buffer is 25-30 seconds long depending on how many exact `PULSE` periods fit inside the 30 seconds, to ensure seamless looping.
If `PULSE` is disabled then it's just 30 seconds long.


The `AudioBufferSourceNode` is initialized with the full 30 second buffer because Safari (at least under iOS) does not like it when `AudioBufferSourceNode` buffers get bigger after initialization, and if they do it just truncates them and ruins the seamlessness of the looping.
Desktop browsers (at least Firefox and Chrome) are okay with buffer size growing after initialization.

`PULSE` ranges on a log scale from 0.2Hz to 10Hz, there's no binaural pulsing (yet).

`WHITENESS` adjusts the cutoff frequency of the low pass filter, it starts at 1 (100Hz) and goes to 11 (1.5kHz) because any whiter makes my ears blead.
