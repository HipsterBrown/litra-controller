# Logitech Litra Glow Controller

This is a fairly simple module and CLI to provide programmatic control of the [Logitech Litra Glow lightbox](https://www.logitech.com/en-us/products/lighting/litra-glow.946-000001.html) over USB. This package uses [node-hid](https://github.com/node-hid/node-hid) to use the HID-API in Node.js. 

**Requirements**

Node 18+ (really any Node version that support ESM and the `parseArgs` utility)

## References

- [Controlling the Logitech Litra Glow via Shortcuts](https://sixcolors.com/post/2022/09/controlling-the-logitech-litra-glow-via-shortcuts/)
- [kharyam/litra-driver](https://github.com/kharyam/litra-driver)
- [dandean/logitech-litra-beam](https://github.com/dandean/logitech-litra-beam)

## Usage

### CLI

The CLI can be invoked as `litra`:

```
> litra

Welcome to Litra Controller!

Use this CLI to control your Logitech Litra Glow!
--help, -h:            Get info about commands and various controls
--info, -i:            Get info about the device, if connected
--on:                  Turn on the light
--off:                 Turn off the light
--brightness, -b:      Set the brightness of the light, 0-100
--temp, -t:            Set the temperature of the light (color shade), between 2700 and 6500
```

Get info about the connected device:

```
litra --info

┌──────────────┬────────────────┐
│   (index)    │     Values     │
├──────────────┼────────────────┤
│ manufacturer │     'Logi'     │
│   product    │  'Litra Glow'  │
│ serialNumber │ 'xxxxxxxxxxxx' │
└──────────────┴────────────────┘
```

Turn on the light:

```
litra --on
```

Turn off the light:

```
litra --off
```

Adjust the brightness (between 0 and 100):

```
litra --brightness 40
```

Adjust the color temperature (between 2700 and 6500):

```
litra --temp 4400
```

The options can be chained together as well:

```
litra --on --brightness 60 --temp 5000
```

### Module

This package can also be installed as a dependency of another Node.js project and used as a module:

```js
import { LitraController } from 'litra-controller';

const device = new LitraController();

device.getInfo();
device.on();
device.off();
device.setBrightness(55);
device.setTemperature(2700);
```
