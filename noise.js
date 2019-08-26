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
    //TODO Generate shaped noise, avoid biquadfilter
    var bloop = 30
    if(mod_period != 0){
        var periods = Math.floor(bloop/mod_period)
        var buffer_size = periods*mod_period*audioContext.sampleRate
        console.log(periods)
        console.log(bloop/mod_period)
    }
    else{
        var buffer_size = bloop*audioContext.sampleRate
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
            vol_scale = 0.4*Math.sin(sin_scale * i) + 1.2
            buffer_data[i] = (Math.random() * 2 - 1) * vol_scale;
        }
    }
    return buffer
}

var white_noise = audioContext.createBufferSource();
white_noise.buffer = generate_buffer(1.0/Math.exp(-1.6));
white_noise.loop = true;
white_noise.start(0);
white_noise.connect(shaper);

white_noise.buffer = generate_buffer(0);

function get_pulse_hz(){
    selected=$("#pulsePeriod")[0].value
    return Math.exp(selected)
}

function get_whitenes_factor(){
    //TODO: Adjust volume for whiter noises
    return ($("#shaperFreq")[0].value-100)*(10/1400) + 1
}


function play_pause(){
    if($("#butStart")[0].value == "START"){
        $("#audio")[0].play();
        audioContext.resume()
        $("#butStart")[0].value = "STOP"
        $("#butStart").removeClass("button-unselected")
        $("#butStart").addClass("button-selected")
    }else{
        $("#audio")[0].pause();
        audioContext.suspend()
        $("#butStart")[0].value = "START"
        $("#butStart").addClass("button-unselected")
        $("#butStart").removeClass("button-selected")
    }
    
}

var defaultButtonColor
function pulse_enable(){
    if($("#pulseEnable")[0].value == "PULSE"){
        volmod_hz = get_pulse_hz()
        white_noise.buffer = generate_buffer(1.0/volmod_hz);
        $("#pulseEnable")[0].value = "UNPULSE"
        $("#pulseEnable").removeClass("button-unselected")
        $("#pulseEnable").addClass("button-selected")
    }else{
        white_noise.buffer = generate_buffer(0);
        $("#pulseEnable")[0].value = "PULSE"
        $("#pulseEnable").removeClass("button-selected")
        $("#pulseEnable").addClass("button-unselected")
    }
}

function whiteness_drag(){
    $("#whiteness")[0].innerText = "whiteness " + get_whitenes_factor().toFixed(2)
}

function pulse_drag(){
    $("#pulseHz")[0].innerText = "pulse " + get_pulse_hz().toFixed(2) + "Hz"
}

function filter_update(){
    $("#whiteness")[0].innerText = "whiteness " + get_whitenes_factor().toFixed(2)
    shaper.frequency.value=$("#shaperFreq")[0].value
}

function update_pulse(){
    volmod_hz = get_pulse_hz()
    $("#pulseHz")[0].innerText = "pulse " + volmod_hz.toFixed(2) + "Hz"
    if($("#pulseEnable")[0].value != "PULSE"){
        white_noise.buffer = generate_buffer(1.0/volmod_hz);
    }
}

function init(){
    $("#pulseHz")[0].innerText = "pulse " + get_pulse_hz().toFixed(2) + "Hz"
    $("#whiteness")[0].innerText = "whiteness " + get_whitenes_factor().toFixed(2)
    shaper.frequency.value = $("#shaperFreq")[0].value
    defaultButtonColor = $("#pulseEnable")[0].style.backgroundColor
}