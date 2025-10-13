# ShiggyCord

An unofficial fork of ShiggyCord, made just for fun
Idea taken from Rosiecord

## Installing

### Android

- Rooted: [Shiggy Xposed](https://github.com/kmmiio99o/ShiggyXposed)

- Non-Rooted: [Shiggy Manger](https://github.com/kmmiio99o/ShiggyManager)

### Android/iOS
- **Injecting bundle:** ``https://github.com/kmmiio99o/ShiggyCord/releases/download/<VERSION>/shiggycord.js``

## Building
1. Install a ShiggyCord loader with loader config support (any mentioned in the [Installing](#installing) section).
1. Go to Settings > General and enable Developer Settings.
1. Clone the repo:
    ```
    git clone https://github.com/kmmiio99o/Shiggycord.git
    ```
1. Install dependencies:
    ```
    bun i
    ```
1. Build ShiggyCord's code:
    ```
    bun run build
    ```
1. In the newly created `dist` directory, run a HTTP server. I recommend [http-server](https://www.npmjs.com/package/http-server).
1. Go to Settings > Developer enabled earlier. Enable `Load from custom url` and input the IP address and port of the server (e.g. `http://192.168.1.236:4040/shiggycord.js`) in the new input box labelled `ShiggyCord URL`.
1. Restart Discord. Upon reload, you should notice that your device will download ShiggyCord's bundled code from your server, rather than GitHub.
1. Make your changes, rebuild, reload, go wild!

Alternatively, you can directly *serve* the bundled code by running `bun run serve`. `shiggycord.js` will be served on your local address under the port 4040. You will then insert `http://<local ip address>:4040/shiggycord.js` as a custom url and reload. Whenever you restart your mobile client, the script will rebuild the bundle as your client fetches it.
