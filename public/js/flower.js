/**
 *  80 bpm
 *  
 */

// setup Tone
Tone.Transport.bpm.value = 80;

var flowerPlayer = new Tone.Player("./audio/ChatAppBedroomJammerdraftRoughArrangement_80bpm.mp3", startPlayerAndTransport);

flowerPlayer.toMaster();


function startPlayerAndTransport() {
  Tone.Transport.start(0);

  flowerPlayer.loop = true;

  var loopStart = Tone.Transport.transportTimeToSeconds("0:0:0");
  var loopEnd = Tone.Transport.transportTimeToSeconds("8:0:0");

  flowerPlayer.setLoopPoints(loopStart, loopEnd)
  flowerPlayer.start(0);
  flowerPlayer.volume.value = -12;

  eyeSynth.start(0);
}

function toggleLoopPoint(measure) {

  var currentMeasure = Tone.Transport.position.split(":")[0];
  var nextMeasure = Number(currentMeasure) + 1;
  nextMeasure =  nextMeasure + ":0:0";

  console.log('current Measure' + currentMeasure);
  console.log('next Measure' + nextMeasure);

  // schedule the change to happen on the nextMeasure
  Tone.Transport.setTimeline(function(time) {
    // do it at next loop point
    flowerPlayer.stop(time);

    var loopStart = Tone.Transport.transportTimeToSeconds(measure + ":0:0");
    var loopEnd = Tone.Transport.transportTimeToSeconds(measure + 1 + ":0:0");
    console.log(loopStart);
    console.log(loopEnd);
    flowerPlayer.setLoopPoints(loopStart, loopEnd)

    // do it at next loop point
    flowerPlayer.start(time);
    console.log('hi');
  }, nextMeasure);
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

  comb.chain(eq, adsr, filter, chorus, Tone.Master);
  filter.toMaster();

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

  return this;
})();


var whatKey = ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"];

// ENV FOLLOWER
var envFollower = new Tone.Follower(0.05, 0.02);
flowerPlayer.connect(envFollower);

var osc = new Tone.OmniOscillator();
osc.start();
osc.frequency.value = "Db5";
osc.toMaster();
envFollower.connect(osc.volume);

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

window.onmousedown = function(e) {
  var numb = Math.floor(e.x/100);
  var note = whatKey[numb % whatKey.length];
  var octave = String( Math.floor(numb / 5.1) + 2);
  console.log(note + octave);
  appleSynth.triggerAttack(note + octave);
}

window.onmouseup = function(e) {
  appleSynth.triggerRelease();
}