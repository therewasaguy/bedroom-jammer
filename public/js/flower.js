/**
 *  80 bpm
 *  
 */

// setup Tone
Tone.Transport.bpm.value = 80;

var leafPlayers = [];
leafPlayers.push( new Tone.Player("./audio/stems/leafs/Chat_App_Bedroom_Jammer_draft_45_mixed_slightly_hmm.mp3") );
leafPlayers.push( new Tone.Player("./audio/stems/leafs/Chat_App_Bedroom_Jammer_draft_45_mixed_slightly_808_Snare.mp3") );
leafPlayers.push( new Tone.Player("./audio/stems/leafs/Chat_App_Bedroom_Jammer_draft_45_mixed_slightly_Big_Kick.mp3") );


var leafMeters = [];
for (var i in leafPlayers) {
  leafMeters.push( new Tone.Meter(1, 0.2, 0) );
  leafMeters[i].toMaster();
}

// var cloudPlayer = new Tone.Player("Chat_App_Bedroom_Jammer_draft_45_mixed_slightly_metalsound.mp3");


//invoked when all of the queued samples are done loading
Tone.Buffer.onload = function(){
  startPlayerAndTransport();
};

function startPlayerAndTransport() {
  Tone.Transport.start(0);

  var loopStart = Tone.Transport.transportTimeToSeconds("0:0:0");
  var loopEnd = Tone.Transport.transportTimeToSeconds("8:0:0");

  for (var i = 0; i < leafPlayers.length; i++) {
    leafPlayers[i].toMaster();
    leafPlayers[i].loop = true;
    leafPlayers[i].setLoopPoints(loopStart, loopEnd)
    leafPlayers[i].start(0);
    leafPlayers[i].volume.value = -64;
  }

  eyeSynth.start(0);
}

var toggleLoopPoint = function(measure, aPlayer) {
  var player = aPlayer;
  var currentMeasure = Tone.Transport.position.split(":")[0];
  var nextMeasure = Number(currentMeasure) + 1;
  nextMeasure =  nextMeasure + ":0:0";

  // console.log('current Measure' + currentMeasure);
  // console.log('next Measure' + nextMeasure);

  aPlayer.volume.value = 12;

  // schedule the change to happen on the nextMeasure
  Tone.Transport.setTimeline(function(time) {
    // do it at next loop point
    aPlayer.stop(time);

    var loopStart = Tone.Transport.transportTimeToSeconds(measure + ":0:0");
    var loopEnd = Tone.Transport.transportTimeToSeconds(measure + 1 + ":0:0");

    aPlayer.setLoopPoints(loopStart, loopEnd)

    // do it at next loop point
    aPlayer.start(time);
  }, nextMeasure);
}

var stopLooping = function(aPlayer) {
  console.log('remove loop point');
  aPlayer.volume.value = -64;
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
  this.output.connect(Tone.Master);

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

    lfo.oscillator.frequency.value = freq;
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