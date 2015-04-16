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