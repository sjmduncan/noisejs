// Setup audio context, start with paused playback
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var shaper = audioContext.createBiquadFilter();
shaper.connect(audioContext.destination)
shaper.frequency.value = 300
shaper.type = "lowpass"
shaper.Q = 4
audioContext.suspend()

function generate_buffer(mod_period){
    if(mod_period != 0)
        var buffer_size = mod_period*2*audioContext.sampleRate
    else{
        var buffer_size = 2*audioContext.sampleRate
    }
    var buffer = audioContext.createBuffer(1, buffer_size, audioContext.sampleRate)
    var buffer_data = buffer.getChannelData(0)
    var lastOut = 0
    if(mod_period ==0){
        for (var i = 0; i < buffer_size; i++) {
            buffer_data[i] = Math.random() * 2 - 1;
        }
    }else{
        var samples_period = mod_period*audioContext.sampleRate
        var sin_scale =  (2 * Math.PI) / samples_period
        for (var i = 0; i < buffer_size; i++) {
            vol_scale = 0.5*Math.sin(sin_scale * i) + 1
            buffer_data[i] = (Math.random() * 2 - 1) * vol_scale;
        }
    }
    return buffer
}

var white_noise = audioContext.createBufferSource();
white_noise.buffer = generate_buffer(0);
white_noise.loop = true;
white_noise.start(0);
white_noise.connect(shaper);

function volmod_period(){
    period=$("#volmodPeriod").val()
    return 1.0/period
}

function play(){
    $("#audio")[0].play();
    audioContext.resume()
}

function pause() {
    $("#audio")[0].pause();
    audioContext.suspend()

}
var is_pulsing = false
function volmod_enable(){
    if(!is_pulsing){
        volmod_hz = volmod_period()
        white_noise.buffer = generate_buffer(volmod_hz);
        $("#volmodEnable").val("!PULSE!")
    }else{
        white_noise.buffer = generate_buffer(0);
        $("#volmodEnable").val("PULSE")
    }
    is_pulsing = !is_pulsing;
}

function volmod_update(){
    if(is_pulsing){
        volmod_hz = volmod_period()
        white_noise.buffer = generate_buffer(volmod_hz);
    }
}