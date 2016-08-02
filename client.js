/**
 *
 * Headless client for Spotify and LIFX bulbs
 *
 */

var Mopidy = require("mopidy");

var Color = require("color");

var Sequencer = require("./lib/com/uxvirtual/lightsd/sequencer");

var mopidy = new Mopidy({
    autoConnect: false,
    webSocketUrl: "ws://localhost:6680/mopidy/ws/"/*,
    callingConvention: 'by-position-or-by-name'*/
});

var printCurrentTrack = function (track) {
    if (track) {
        console.log("Currently playing:", track.name, "by",
            track.artists[0].name, "from", track.album.name);
    } else {
        console.log("No current track");
    }
};

var queueAndPlay = function (playlistName, trackName) {
    //playlistName = playlistName;
    //trackName = trackName;
    mopidy.playlists.getPlaylists().then(function (playlists) {

        for(var i = 0; i < playlists.length; i++){
            if(playlists[i].name === playlistName){

                var playlist = playlists[i];
                console.log("Loading playlist:", playlist.name);

                //console.log("Tracks: ",playlist.tracks);

                mopidy.tracklist.clear();


                return mopidy.tracklist.add(playlist.tracks).then(function (tlTracks) {

                    for(var x = 0; x < tlTracks.length; x++){
                        if(tlTracks[x].track.name === trackName){

                            //console.log(mopidy.tracklist);

                            //return;

                            mopidy.tracklist.setRepeat(true);
                            mopidy.tracklist.setSingle(true);

                            return mopidy.playback.play(tlTracks[x]).then(function () {
                                return mopidy.playback.getCurrentTrack().then(function (track) {
                                    console.log("Now playing:", trackDesc(track));
                                });
                            });
                        }
                    }


                });
            }
        }
    })
    .catch(console.error.bind(console)) // Handle errors here
    .done();                            // ...or they'll be thrown here
};

mopidy.on(console.log.bind(console));  // Log all events


mopidy.on("state:online", function () {

    console.log('Mopidy is online.');

    //mopidy.playback.next();

    mopidy.playback.getCurrentTrack()
        .done(printCurrentTrack);

    queueAndPlay('EVE Online','Shouting Valley');
});

//start music

// ... do other stuff, like hooking up events ...
//mopidy.connect();

//start lights

/*Sequencer.getLights().then(function(target){

    //NOTE: see for color options: https://www.npmjs.com/package/color

    var colorArray = [
        "red",
        "green",
        "blue",
        "cyan",
        "magenta",
        "yellow",
        "white"
    ];

    var rand = colorArray[Math.floor(Math.random() * colorArray.length)];

    //Sequencer.setLight(target,Color().rgb(0, 255, 0).darken(0.9),9000,1000);
    Sequencer.animateLight(target,Color(rand).darken(0.95),Color().rgb(255, 0, 0).darken(0.9),4000,250,'SINE',5,0.5);
    //setLight(target,Color("purple"),4000,1000);
    //setLight(target,Color("white"),4000,1000);

},function(err){
    console.log(err);
});*/

//NOTE: see https://github.com/ZECTBynmo/node-core-audio for information on reading sound card output buffer

// Create a new instance of node-core-audio
var coreAudio = require("node-core-audio");

// Create a new audio engine
var engine = coreAudio.createNewAudioEngine();

var numDevices = engine.getNumDevices();

//can only get input from mic or other input device. Would need some kind of loopback cable to get this to work -_- OR could use loopback for OSX
var inputDeviceId;
var outputDeviceId;
for (var i = 0; i < numDevices; i++) {
    var name = engine.getDeviceName(i);
    console.log('Device #'+i+' '+name);
    if (!inputDeviceId && /Soundflower \(2ch\)/.test(name)) {
        inputDeviceId = i;
    }

    if (!outputDeviceId && /Built-in Output/.test(name)) {
        outputDeviceId = i;
    }
}


engine.setOptions({ inputChannels: 2, outputChannels: 2, interleaved: true, inputDevice: inputDeviceId, outputDevice: outputDeviceId }); //interleaving must be turned on to read input values

// Add an audio processing callback
// This function accepts an input buffer coming from the sound card,
// and returns an output buffer to be sent to your speakers.
//
// Note: This function must return an output buffer
/*function processAudio( inputBuffer ) {
    console.log( "%d channels", inputBuffer.length );
    console.log( "Channel 0 has %d samples", inputBuffer[0].length );

    console.log(inputBuffer);

    //don't return the inputBuffer as it'll mess up audio output

    //return inputBuffer;
}

engine.addAudioCallback( processAudio );*/

var sample = 0;
var ampBuffer = new Float32Array(1);

engine.addAudioCallback(function(buffer) {
    var output = [];
    /*for (var i = 0; i < buffer.length; i++, sample++) {
        //console.log(buffer[i]);

        //Save input into rolling buffer
        ampBuffer[sample%ampBuffer.length] = buffer[i];
    }*/

    ampBuffer[sample%ampBuffer.length] = buffer[0];

    return buffer;
});

var lastFPS = '', frames = 0, lastFrameTime = Date.now();

var h = 100;

Sequencer.getLights().then(function(target){

    setInterval(function(){
        /*for (var i = 0; i < ampBuffer.length; i++) {

            var brightness = h / 2 + ampBuffer[i] * h / 3.0;

            Sequencer.setLight(target,Color().rgb(0, 255, 0).darken(1-(brightness/100)),9000,1000).then(function(){

            },function(err){
                console.log('Error connecting to light. Skipping...');
            });
        }*/

        //console.log(ampBuffer[0]);

        if(ampBuffer.length > 0){
            //var brightness = (h / 2 + ampBuffer[0] * h / 3.0);

            console.log(Math.abs(ampBuffer[0]));

            var brightness = Math.abs(ampBuffer[0]);

            if(brightness > 1){
                brightness = 1;
            }else if(brightness < 0){
                brightness = 0;
            }

            brightness = 1-brightness;

            Sequencer.setLight(target,Color().rgb(100, 100, 100).darken(brightness),4000,1000).then(function(){

            },function(err){
                console.log('Error connecting to light. Skipping...');
            });


        }



        /*var newTime = Date.now();
        if (newTime - lastFrameTime > 1000) {
            lastFPS = frames;
            frames = 0;
            lastFrameTime = newTime;
        }

        frames++;*/

    },100);


});



