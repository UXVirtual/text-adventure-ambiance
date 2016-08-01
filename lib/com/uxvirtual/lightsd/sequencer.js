// create a unique, global symbol name
// -----------------------------------

const SEQUENCER = Symbol.for("com.uxvirtual.lightsd.sequencer");

// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------

var globalSymbols = Object.getOwnPropertySymbols(global);
var hasSymbol = (globalSymbols.indexOf(SEQUENCER) > -1);

if (!hasSymbol){
    global[SEQUENCER] = {
        //global vars go here
    };
}

// define the singleton API
// ------------------------


var net = require('net');
var uuid = require('uuid4');

var client = new net.Socket();

client.on('close', function() {
    console.log('Connection closed');
});

var singleton = {

    getLights: function(){

        return new Promise(function(resolve, reject) {
            //connect to bulb and send request
            client.connect(6999, '127.0.0.1', function() {
                console.log('Connected');
                client.write(JSON.stringify({jsonrpc: "2.0", id: uuid(), method: 'get_light_state', params: ["*"]}));
            });

            //wait for response and act accordingly
            client.on('data', function(data) {
                console.log('Received: ' + data);

                var json = JSON.parse(data);

                client.destroy(); // kill client after server's response

                if(typeof json.result[0] !== 'undefined'){
                    var target = String(json.result[0]._lifx.addr).replace(/:/g,'');
                    resolve(target);
                }else{
                    console.log('*** NO LIGHTS FOUND ***');
                    reject('No lights found');
                }
            });
        });


    },

    /**
     set_light_from_hsbk(target, h, s, b, k, t)
     Parameters:
     h (float) – Hue from 0 to 360.
     s (float) – Saturation from 0 to 1.
     b (float) – Brightness from 0 to 1.
     k (int) – Temperature in Kelvin from 2500 to 9000.
     t (int) – Transition duration to this color in ms.
     */

    setLight: function(target,rgbColor,temperature,time){

        console.log('Animating light at '+target);

        return new Promise(function(resolve, reject) {
            var hslArray = rgbColor.hslArray();

            console.log(hslArray);

            client.connect(6999, '127.0.0.1', function() {
                console.log('Connected');
                client.write(JSON.stringify({jsonrpc: "2.0", id: uuid(), method: 'set_light_from_hsbk', params: [target,hslArray[0],hslArray[1]/100,hslArray[2]/100,temperature,time]}));
            });

            client.on('data', function(data) {
                console.log('Received: ' + data);

                client.destroy(); // kill client after server's response

                resolve(target);

            });
        });


    },

    /**
     set_waveform(target, waveform, h, s, b, k, period, cycles, skew_ratio, transient)
     Parameters:
     waveform (string) – One of SAW, SINE, HALF_SINE, TRIANGLE, SQUARE.
     h (float) – Hue from 0 to 360.
     s (float) – Saturation from 0 to 1.
     b (float) – Brightness from 0 to 1.
     k (int) – Temperature in Kelvin from 2500 to 9000.
     period (int) – milliseconds per cycle.
     cycles (int) – number of cycles.
     skew_ratio (float) – from 0 to 1.
     transient (bool) – if true the target will keep the color it has at the end of the waveform, otherwise it will revert back to its original state.
     */

    animateLight: function(target,fromrgbColor,torgbColor,temperature,time,waveform,cycles,skew_ratio){

        console.log('Animating light at '+target);

        var self = this;

        return new Promise(function(resolve, reject) {

            setTimeout(function(){
                self.setLight(target,fromrgbColor,temperature,time).then(function(target){

                    var hslArray = torgbColor.hslArray();

                    //TODO: need to find way to see if light has actually changed color before proceeding to animation

                    client.connect(6999, '127.0.0.1', function() {
                        console.log('Connected');
                        client.write(JSON.stringify({jsonrpc: "2.0", id: uuid(), method: 'set_waveform', params: [target,waveform,hslArray[0],hslArray[1]/100,hslArray[2]/100,temperature,time,cycles,skew_ratio,true]}));
                    });

                    client.on('data', function(data) {
                        console.log('Received: ' + data);

                        client.destroy(); // kill client after server's response

                        resolve(target);

                    });

                },function(err){
                    console.log(err);
                });
            },2000);


        });
    }
};

Object.defineProperty(singleton, "instance", {
    get: function(){
        return global[SEQUENCER];
    }
});

// ensure the API is never changed
// -------------------------------

Object.freeze(singleton);

// export the singleton API only
// -----------------------------

module.exports = singleton;