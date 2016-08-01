/**
 *
 * Headless client for Spotify and LIFX bulbs
 *
 */

var Mopidy = require("mopidy");

var uuid = require('uuid4');

var Color = require("color")

var mopidy = new Mopidy({
    autoConnect: false,
    webSocketUrl: "ws://localhost:6680/mopidy/ws/"/*,
    callingConvention: 'by-position-or-by-name'*/
});

var net = require('net');

var client = new net.Socket();

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

var getLights = function(callback){
    client.connect(6999, '127.0.0.1', function() {
        console.log('Connected');
        client.write(JSON.stringify({jsonrpc: "2.0", id: uuid(), method: 'get_light_state', params: ["*"]}));
    });

    client.on('data', function(data) {
        console.log('Received: ' + data);

        var json = JSON.parse(data);

        //console.log(json.result[0]._lifx.addr);

        client.destroy(); // kill client after server's response

        if(typeof json.result[0] !== 'undefined' && callback){
            var target = String(json.result[0]._lifx.addr).replace(/:/g,'');
            callback(target);
        }

        //returns:
        //{"jsonrpc": "2.0", "id": "JSON_RPC_ID", "result": [{"_lifx":{"addr":"LIFX_ADDR","gateway":{"site":"SITE_ID","url":"tcp://[::ffff:IP_ADDRESS]:56700","latency":0},"mcu":{"firmware_version":"1.13"},"wifi":{"firmware_version":"0.0"}},"_model":"Color 1000","_vendor":"LIFX","hsbk":[0,0,1,2750],"power":true,"label":"Kitchen Bulb","tags":[]}]}


    });
};

var setLight = function(target,rgbColor,temperature,time){

    console.log('Animating light at '+target);

    var hslArray = rgbColor.hslArray();

    console.log(hslArray);

    client.connect(6999, '127.0.0.1', function() {
        console.log('Connected');
        client.write(JSON.stringify({jsonrpc: "2.0", id: uuid(), method: 'set_light_from_hsbk', params: [target,hslArray[0],hslArray[1]/100,hslArray[2]/100,temperature,time]}));
    });

    client.on('data', function(data) {
        console.log('Received: ' + data);

        client.destroy(); // kill client after server's response

    });
};

var animateLight = function(target){

    console.log('Animating light at '+target);

    client.connect(6999, '127.0.0.1', function() {
        console.log('Connected');
        client.write(JSON.stringify({jsonrpc: "2.0", id: uuid(), method: 'set_waveform', params: [target,'SINE',50,1,0.5,9000,1000,20,0.5,true]}));
    });

    client.on('data', function(data) {
        console.log('Received: ' + data);

        client.destroy(); // kill client after server's response

    });
};

getLights(function(target){
    //setLight(target,Color().rgb(0, 255, 0),9000,1000);
    //setLight(target,Color("purple"),4000,1000);
    setLight(target,Color("white"),4000,1000);
});

client.on('close', function() {
    console.log('Connection closed');
});

