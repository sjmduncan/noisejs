// Setup audio context, start with paused playback
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var shaper = audioContext.createBiquadFilter();
shaper.connect(audioContext.destination)
shaper.frequency.value = 300
shaper.type = "lowpass"
shaper.Q = 0.4
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
white_noise.buffer = generate_buffer(1/0.01);
white_noise.loop = true;
white_noise.start(0);
white_noise.connect(shaper);

white_noise.buffer = generate_buffer(0);

function get_pulse_hz(){
    period=$("#pulsePeriod").val()
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
function pulse_enable(){
    if(!is_pulsing){
        volmod_hz = get_pulse_hz()
        white_noise.buffer = generate_buffer(volmod_hz);
        $("#pulseEnable").val("!PULSE!")
    }else{
        white_noise.buffer = generate_buffer(0);
        $("#pulseEnable").val("PULSE")
    }
    is_pulsing = !is_pulsing;
}

function whiteness_drag(){
    $("#whiteness")[0].innerText = "whiteness " + (1*$("#shaperFreq")[0].value).toFixed(0)
}

function pulse_drag(){
    $("#pulseHz")[0].innerText = "pulse " + (1*$("#pulsePeriod")[0].value).toFixed(2) + "Hz"
}

function filter_update(){
    $("#whiteness")[0].innerText = "whiteness " + (1*$("#shaperFreq")[0].value).toFixed(0)
    shaper.frequency.value=$("#shaperFreq")[0].value
}

function update_pulse(){
    volmod_hz = get_pulse_hz()
    $("#pulseHz")[0].innerText = "pulse " + (1*$("#pulsePeriod")[0].value).toFixed(2) + "Hz"
    if(volmod_hz < 0.01){
        $("#pulsePeriod").val(0.01)
    }
    else if(is_pulsing){
        white_noise.buffer = generate_buffer(volmod_hz);
    }
}

function init(){
    $("#pulseHz")[0].innerText = "pulse " + (1*$("#pulsePeriod")[0].value).toFixed(2) + "Hz"
    $("#whiteness")[0].innerText = "whiteness " + (1*$("#shaperFreq")[0].value).toFixed(0)
}