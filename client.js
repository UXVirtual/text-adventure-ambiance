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

Sequencer.getLights().then(function(target){

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
    Sequencer.animateLight(target,Color(rand).darken(0.9),Color().rgb(255, 0, 0).darken(0.9),9000,250,'SINE',5,0.5);
    //setLight(target,Color("purple"),4000,1000);
    //setLight(target,Color("white"),4000,1000);

},function(err){
    console.log(err);
});

