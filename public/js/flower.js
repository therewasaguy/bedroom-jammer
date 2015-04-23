/**
 *  80 bpm
 *  
 */

// everything connects to the MasterMix, then to WetDry to control convolution and filter
var masterMix = Tone.context.createGain();

// MasterMix connects to MasterWetDry. 0 is dry, 1 is wet (convolver)
var masterWetDry = new Tone.CrossFade(0);

// convolver goes to 1 (wet)
var masterConvolver = Tone.context.createConvolver();
masterMix.connect(masterConvolver);
masterConvolver.connect(masterWetDry, 0, 1);

// filter goes to both 0 (dry) and 1 (wet)
var masterFilter = new Tone.Filter();
masterMix.connect(masterFilter);
masterFilter.connect(masterWetDry, 0, 0);
masterFilter.connect(masterWetDry, 0, 1);

// wetDry goes to master
masterWetDry.toMaster();

Tone.Transport.bpm.value = 80;


//////// LEAVES
var leafPlayers = [];
leafPlayers.push( new Tone.Player("./audio/stems/leafs/Chat_App_Bedroom_Jammer_draft_45_mixed_slightly_hmm.mp3") );
leafPlayers.push( new Tone.Player("./audio/stems/leafs/Chat_App_Bedroom_Jammer_draft_45_mixed_slightly_808_Snare.mp3") );
leafPlayers.push( new Tone.Player("./audio/stems/leafs/Chat_App_Bedroom_Jammer_draft_45_mixed_slightly_Big_Kick.mp3") );

var convolverBuffer = new Tone.Buffer('./audio/concrete-tunnel-IR.mp3');

// meters to measure amplitude of each leaf
var leafMeters = [];
for (var i in leafPlayers) {
  leafMeters.push( new Tone.Meter(1, 0.2, 0) );
  leafMeters[i].connect(masterMix);
}

///// CLOUDS
var cloudPlayers = [];
cloudPlayers.push( new Tone.Player("./audio/stems/clouds/otherStuff2.mp3") );
cloudPlayers.push( new Tone.Player("./audio/stems/clouds/bass.mp3") );
cloudPlayers.push( new Tone.Player("./audio/stems/clouds/drums.mp3") );
cloudPlayers.push( new Tone.Player("./audio/stems/clouds/hmmOnly.mp3") );

// meters to measure amplitude of each clouds
var cloudMeters = [];
for (var i in cloudPlayers) {
  cloudMeters.push( new Tone.Meter(1, 0.2, 0) );
  cloudMeters[i].connect(masterMix);
}


//invoked when all of the queued samples are done loading
Tone.Buffer.onload = function(){
  startPlayerAndTransport();
};

// start playing all tracks and start the transport, but every track volume will be -64 (inaudible)
function startPlayerAndTransport() {
  masterConvolver.buffer = convolverBuffer._buffer;

  Tone.Transport.start(0);

  var loopStart = Tone.Transport.transportTimeToSeconds("0:0:0");
  var loopEnd = Tone.Transport.transportTimeToSeconds("8:0:0");

  for (var i = 0; i < leafPlayers.length; i++) {
    // leafPlayers[i].toMaster();
    leafPlayers[i].connect(masterMix);
    leafPlayers[i].loop = true;
    leafPlayers[i].setLoopPoints(loopStart, loopEnd)
    leafPlayers[i].start(0);
    leafPlayers[i].volume.value = -64;
  }

  for (var i = 0; i < cloudPlayers.length; i++) {
    // leafPlayers[i].toMaster();
    cloudPlayers[i].connect(masterMix);
    cloudPlayers[i].loop = true;
    cloudPlayers[i].setLoopPoints(loopStart, loopEnd)
    cloudPlayers[i].start(0);
    cloudPlayers[i].volume.value = -64;
  }

  eyeSynth.start(0);
}

// change the measure that is looping
var toggleLoopPoint = function(measure, aPlayer) {
  var player = aPlayer;
  var currentMeasure = Tone.Transport.position.split(":")[0];
  var nextMeasure = Number(currentMeasure) + 1;
  nextMeasure =  nextMeasure + ":0:0";

  aPlayer.volume.cancelScheduledValues( aPlayer.now() );
  aPlayer.volume.linearRampToValueNow(-6, .02);

  // schedule the change to happen on the nextMeasure
  Tone.Transport.setTimeline(function(time) {
    // do it at next loop point
    aPlayer.pause(time);

    var loopStart = Tone.Transport.transportTimeToSeconds(measure + ":0:0");
    var loopEnd = Tone.Transport.transportTimeToSeconds(measure + 1 + ":0:0");

    if (loopEnd > aPlayer._buffer.duration) {
      aPlayer.start(time);
      return;
    }

    aPlayer.setLoopPoints(loopStart, loopEnd)

    // do it at next loop point
    aPlayer.start(time);
  }, nextMeasure);
}

// stop and fade out after oneMeasure
var stopLooping = function(aPlayer) {
  console.log('remove loop point');

  var oneMeasure = Tone.Transport.transportTimeToSeconds("1:0:0");

  Tone.Transport.setTimeout(function(time) {

    aPlayer.volume.linearRampToValueAtTime(-64, time + oneMeasure);

    // // do it at next loop point
    // aPlayer.start(time);

    // stop metering the leaf level
    // aPlayer.disconnect();

    // reset the tint (just in case)
    // aPlayer.tint = parseInt(rgb2hex(255, 255, 255));

  }, oneMeasure);

}

///////////////////////////////////////

/**
 *  eyeSynth can play() and stop().
 */
var eyeSynth = (function() {
  var omni = new Tone.OmniOscillator();
  omni.volume.value = -12;
  omni.type = 'pwm';

  omni.frequency.value = "C#2";
  omni.modulationFrequency.value = "4n";
  omni.start();

  var lfo = new Tone.LFO("16n", 0.2, 0.9);
  lfo.connect(omni.volume);
  lfo.start();

  var comb = new Tone.FeedbackCombFilter(0.00001, .01);
  comb.resonance.value = 0.2;
  comb.delayTime = 0.001;

  omni.connect(comb);

  var adsr = new Tone.AmplitudeEnvelope(0.3, 0.8, 0.5, .3);

  var filter = new Tone.Filter(7200, "lowpass");
  filter.Q.value = 2;

  filterLFO = new Tone.LFO("3n", 200, 3500);
  filterLFO.connect(filter.frequency);
  filterLFO.start();

  var eq = new Tone.EQ(-3, -25, -20);
  var chorus = new Tone.Chorus("4n", 3.5, .6);

  this.output = Tone.context.createGain();

  comb.chain(eq, adsr, filter, chorus, this.output);
  filter.connect(this.output);
  this.output.connect(masterMix);

  /**
   *  
   *  @method  start
   *  @param {Number} numb eyeSynth pitch, as a position in the whatKey array.
   *  @param {Tone.Time} varname frequency of the LFO that modulates amplitude.
   */
  this.start = function(numb, lfoFreq) {
    var numb = numb || 0;
    var lfoFreq = lfoFreq || "16n";
    var note = whatKey[numb % whatKey.length];
    var octave = String( Math.floor(numb / 5.1) + 2);
    lfo.frequency.value = lfoFreq;
    omni.frequency.value = whatKey[numb % whatKey.length] + octave;
    adsr.triggerAttack(0);
  }

  /**
   *  stop the signal by tiggering release
   */
  this.stop = function() {
    adsr.triggerRelease(0);
  }

  this.setVolume = function(vol) {
    this.output.gain.linearRampToValueAtTime(vol, Tone.prototype.now() );

    var freq = Math.round( Math.abs(1 - vol) * 64 / 4);

    lfo.oscillator.frequency.value = String(freq) + "n";
  }

  // this.setLFO = function(vol) {
    // lfo.}
  // }

  return this;
})();


var whatKey = ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"];

// ENV FOLLOWER
// var envFollower = new Tone.Follower(0.05, 0.02);
// leafPlayer.connect(envFollower);

// var osc = new Tone.OmniOscillator();
// osc.start();
// osc.frequency.value = "Db5";
// osc.toMaster();
// envFollower.connect(osc.volume);

var appleSynth = new Tone.DuoSynth(
{
  "vibratoAmount" : 0.1,
  "vibratoRate" : 5,
  "vibratoDelay" : 0.01,
  "portamento" : 0.001,
  "harmonicity" : 4.005,
  "filter" : {
    "Q" : 0.4,
    "type" : "lowpass",
    "rolloff" : -12
  },
  "voice0" : {
    "volume" : 8,
    "portamento" : 0.01,
    "oscillator" : {
      "type": "triangle",
    },
    "filter" : {
      "Q" : 0.8,
      "type" : "bandpass",
      "frequency" : 600,
      "rolloff" : -12
    },  
    "envelope" : {
      "attack" : 9,
      "decay" : 0.1,
      "sustain" : 0.9,
      "release" : 2
    },
    "filterEnvelope" : {
      "attack" : 0.01,
      "decay" : 0.01,
      "sustain" : 0.01,
      "release" : 1,
      "min" : 800,
      "max" : 2200
    }
  },
  "voice1" : {
    "volume" : 8,
    "portamento" : 0.01,
    "oscillator" : {
      "type": "triangle"
    },
    "filter" : {
      "Q" : 1,
      "type" : "lowpass",
      "frequency" : 7000,
      "rolloff" : -12
    },          
    "envelope" : {
      "attack" : 0.02,
      "decay" : 0.1,
      "sustain" : 0.5,
      "release" : 0.7
    },
    "filterEnvelope" : {
      "attack" : 0.005,
      "decay" : 0.5,
      "sustain" : 0.7,
      "release" : 2,
      "min" : 900,
      "max" : 4200
    }
  }
});

appleSynth.chain(Tone.Master);

playStar = function() {
  var numb = Math.floor( Math.random() * 10 );
  var note = whatKey[numb % whatKey.length];
  var octave = String( Math.floor(numb / 5.1) + 2);
  console.log(note + octave);
  appleSynth.triggerAttackRelease(note + octave, 0.5);
}




// window.onmouseup = function(e) {
//   appleSynth.triggerRelease();
// }