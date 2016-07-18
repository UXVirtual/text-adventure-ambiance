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

## Installation

Installation is manual at this time until an installer script can be created.

1.  Install `mopidy` by following [these instructions](https://docs.mopidy.com/en/latest/installation/).

2.  Install `mopidy-spotify` by following [these instructions](https://github.com/mopidy/mopidy-spotify#installation).

3.  Edit your `mopidy` config file (`nano ~/.config/mopidy/mopidy.conf`) and add your Spotify username and password to
    the bottom of the file:

    ```
    [spotify]
    username = USERNAME
    password = PASSWORD
    ```

    where `USERNAME` is your Spotify username and `PASSWORD` is your Spotify password. If you've created your Spotify
    account using Facebook you'll need to login to your account via Facebook and
    [create a Spotify Device password here](https://www.spotify.com/nz/account/set-device-password/).

3.  If on OSX, run the following command to launch `mopidy`:

    ```
    PYTHONPATH=$(brew --prefix)/lib/python2.7/site-packages mopidy
    ```

4.