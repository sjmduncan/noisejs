// Setup audio context, start with paused playback
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

var oscLeft = audioContext.createOscillator();
var oscRight = audioContext.createOscillator();

var basefreq = 100;
var beatFreq = 10;


var merger = audioContext.createChannelMerger(2);

oscLeft.connect(merger,0,0);
oscRight.connect(merger,0,1);

merger.connect(audioContext.destination);

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

function get_pulse_hz(){
    selected=$("#pulsePeriod")[0].value
    return Math.exp(selected)
}

function get_basefreq_hz(){
    return 1*$("#basefreq")[0].value
}

function update_pulse_val(){
    $("#pulseHz")[0].innerText = "PULSE " + get_pulse_hz().toFixed(2) + "Hz"
}

function update_basefreq_val(){
    $("#base")[0].innerText = "BASE " + get_basefreq_hz().toFixed(0) + "Hz"
}

function update_freqz(){
    basefreq = get_basefreq_hz()
    beatFreq = get_pulse_hz();
    leftright = Math.random() > 0.5
    if(leftright){
        console.log("notLEft")
        oscLeft.frequency.value=basefreq + beatFreq/2;
        oscRight.frequency.value=basefreq - beatFreq/2;
    }else{
        console.log("LEft");
        oscLeft.frequency.value=basefreq - beatFreq/2;
        oscRight.frequency.value=basefreq + beatFreq/2
    }
}

function pulse_drag(){update_pulse_val()}
function basefreq_drag(){update_basefreq_val()}

function basefreq_update(){
    update_freqz();
    update_basefreq_val()
}
function update_pulse(){
    update_freqz();
    update_pulse_val();
}

function init(){
    update_pulse_val()
    update_basefreq_val()
    update_freqz();
    oscLeft.start();
    oscRight.start();
}