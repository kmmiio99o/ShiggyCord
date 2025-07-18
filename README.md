# Kettu
A mod for Discord on Android

NOTE: Kettu only supports 287 and below, if you want to use the latest version or have particular issues with Kettu, try out its future work-in-progress successor [**Lumi**](https://github.com/C0C0B01/Lumi)

Discord https://discord.gg/6cN7wKa8gp
   
## Installing

Only Discord versions 287 and below are supported

- **Root** with Xposed - [KettuXposed](https://github.com/C0C0B01/KettuXposed/releases/latest)
- **Non-root** - [KettuManager](https://github.com/C0C0B01/KettuManager/releases/latest)

## Support Me
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cocobo1)

Please do not donate if you are not able to, if you are able to please don't donate much :)

## Building
1. Install a Kettu loader with loader config support (any mentioned in the [Installing](#installing) section).
1. Go to Settings > General and enable Developer Settings.
1. Clone the repo:
    ```
    git clone https://github.com/C0C0B01/Kettu
    ```
1. Install dependencies:
    ```
    pnpm i
    ```
1. Build Kettu's code:
    ```
    pnpm build
    ```
1. In the newly created `dist` directory, run a HTTP server. I recommend [http-server](https://www.npmjs.com/package/http-server).
1. Go to Settings > Developer enabled earlier. Enable `Load from custom url` and input the IP address and port of the server (e.g. `http://192.168.1.236:4040/kettu.js`) in the new input box labelled `Kettu URL`.
1. Restart Discord. Upon reload, you should notice that your device will download Kettu's bundled code from your server, rather than GitHub.
1. Make your changes, rebuild, reload, go wild!

Alternatively, you can directly *serve* the bundled code by running `pnpm serve`. `kettu.js` will be served on your local address under the port 4040. You will then insert `http://<local ip address>:4040/kettu.js` as a custom url and reload. Whenever you restart your mobile client, the script will rebuild the bundle as your client fetches it.

## Stargazers
[![Star History Chart](https://api.star-history.com/svg?repos=C0C0B01/Kettu&type=Date)](https://star-history.com/#bytebase/star-history&Date)
