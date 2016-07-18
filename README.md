Text Adventure Ambiance
=======================

Ambiance engine that connects to []TextAdventure.js](https://github.com/HAZARDU5/TextAdventure.js) node service.
Integrates with Spotify and LIFX smartbulbs.

The aim of this project is to create an immersive atmosphere for your Text Adventure games, whether you're playing
alone or with your friends.

## Features

*   Plays tracks from selected Spotify playlist

*   Changes light colors and effects on select LIFX smartbulbs

*   Synchronises the above with customizable presets per in-game room

    *   Thunder / lightning

    *   Battle

    *   Swamp

    *   Flickering lights with customisable colour

*   Presets are enhanced depending on how many bulbs are connected

## Dependencies

*   [mopidy](https://github.com/mopidy/mopidy) - Music server that supports streaming from third party services

*   [mopidy-spotify](https://github.com/mopidy/mopidy-spotify) - Extension for mopidy allowing Spotify integration

*   [lightsd](https://github.com/lopter/lightsd) - Daemon for controlling smartbulbs. Includes LIFX support

*   [TextAdventure.js](https://github.com/HAZARDU5/TextAdventure.js) - My fork of TextAdventure.js that has support for
    reading the game state of any user's single-player adventure using simple API