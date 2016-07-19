Text Adventure Ambiance
=======================

Ambiance engine that connects to [TextAdventure.js](https://github.com/HAZARDU5/TextAdventure.js) node service.
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

## References

*   [Writing a JSON-RPC over TCP client for `lightsd`](http://lightsd.readthedocs.io/en/latest/protocol.html#writing-a-client-for-lightsd)

## Installation

Installation is manual at this time until an installer script can be created.

1.  If on OSX run `xcode-select --install` to install command line build tools. These are required to install `mopidy`
    and its extensions.

2.  Install `mopidy` by following [these instructions](https://docs.mopidy.com/en/latest/installation/). Be sure to set
    the `PYTHONPATH` in your `.bash_profile` or equivalent as described in the installation instructions link or
    the install of `mopidy-spotify` will fail below.

3.  Install `mopidy-spotify` by following [these instructions](https://github.com/mopidy/mopidy-spotify#installation).
    Note: if you have issues installing this, make sure that you don't have an alternate installation of python2.7 set
    in your path. MAMP on OSX can cause conflicts with its version of python if the apache2 bin folder is included in
    the PATH (e.g. `export PATH="/Applications/MAMP/bin/apache2/bin:$PATH"`). Remove this line and relaunch your
    terminal if this is a problem.

4.  Edit your `mopidy` config file (`nano ~/.config/mopidy/mopidy.conf`) and add your Spotify username and password to
    the bottom of the file:

    ```
    [spotify]
    username = USERNAME
    password = PASSWORD
    bitrate = 320
    ```

    where `USERNAME` is your Spotify username and `PASSWORD` is your Spotify password. If you've created your Spotify
    account using Facebook you'll need to login to your account via Facebook and
    [create a Spotify Device password here](https://www.spotify.com/nz/account/set-device-password/). If you get a
    *There was a problem setting your password* error when setting your Spotify password, ignore it and use the password
    you set anyway.

    See the mopidy-spotify extension [Configuration](https://github.com/mopidy/mopidy-spotify#configuration) page for
    more information on configuring this file for Spotify.

5.  Install `lightsd` by following [these instructions](http://lightsd.readthedocs.io/en/latest/installation.html).

6.  If on OSX run `brew services start lopter/lightsd/lightsd` to install lightsd as a daemon so it runs in the background.

## Running

*  If on OSX, run the following command to launch `mopidy`. It will then be available to accept commands on port `6680`:

    ```
    mopidy
    ```

## JavaScript Library

There is a [library available here](http://mopidy.readthedocs.io/en/latest/api/js/) that wraps the API and works with
`npm`.