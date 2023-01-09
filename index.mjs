import { parseArgs } from 'node:util'
import { HID } from 'node-hid'

const options = {
  help: {
    type: 'boolean',
    short: 'h'
  },
  info: {
    type: 'boolean',
    short: 'i'
  },
  on: {
    type: 'boolean',
  },
  off: {
    type: 'boolean',
  },
  brightness: {
    type: 'string',
    short: 'b'
  },
  temp: {
    type: 'string',
    short: 't'
  }
}
const { values, positionals } = parseArgs({ options, allowPositionals: true })

if (values.help || positionals.includes('help') || (Object.keys(values).length === 0 && positionals.length === 0)) {
  console.log('Welcome to Litra Controller!')
  console.log(`
Use this CLI to control your Logitech Litra Glow!
--help, -h:            Get info about commands and various controls
--info, -i:            Get info about the device, if connected
--on:                  Turn on the light
--off:                 Turn off the light
--brightness, -b:      Set the brightness of the light, 0-100
--temp, -t:            Set the temperature of the light (color shade), between ${TEMP_MIN} and ${TEMP_MAX}
`)
  process.exit(0)
}

const VENDOR_ID = 0x046d
const PID_GLOW = 0xc900
// const PID_BEAM = 0xc901
const LIGHT_OFF = 0x00
const LIGHT_ON = 0x01
const BRIGHTNESS_MIN = 0x14
const BRIGHTNESS_MAX = 0xfa
const TEMP_MAX = 6500
const TEMP_MIN = 2700

const glow = new HID(VENDOR_ID, PID_GLOW)

if (values.info || positionals.includes('info')) {
  const info = glow.getDeviceInfo()
  console.table(info)
  process.exit(0)
}

if (values.on || positionals.includes('on')) {
  on();
}

if (values.off || positionals.includes('off')) {
  off()
}

if (values.brightness) {
  const level = parseInt(values.brightness, 10)
  if (level >= 0 || level <= 100) {
    setBrightness(level)
  } else {
    console.error('Brightness level must be between 0 and 100')
    process.exit(1)
  }
}

if (values.temp) {
  const temp = parseInt(values.temp, 10)
  if (temp >= TEMP_MIN || temp <= TEMP_MAX) {
    setTemp(temp)
  } else {
    console.error(`Temperature setting must be between ${TEMP_MIN} and ${TEMP_MAX}`)
    process.exit(1)
  }
}

function on() {
  glow.write([0,
    0x11, 0xff, 0x04, 0x1c, LIGHT_ON,
    0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00])
}

function off() {
  glow.write([0,
    0x11, 0xff, 0x04, 0x1c, LIGHT_OFF,
    0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00])
}

function setBrightness(level) {
  const adjustedLevel = Math.floor(BRIGHTNESS_MIN + ((level / 100) * (BRIGHTNESS_MAX - BRIGHTNESS_MIN)))

  glow.write([0,
    0x11, 0xff, 0x04, 0x4c, 0x00,
    adjustedLevel, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00])
  console.log(`Brightness level set to ${level}%`)
}

function setTemp(temp) {
  const adjustedTemp = temp.toString(16).padStart(4, '0').toUpperCase()

  const temp1 = parseInt(adjustedTemp.slice(0, 2), 16)
  const temp2 = parseInt(adjustedTemp.slice(2), 16)

  glow.write([0,
    0x11, 0xff, 0x04, 0x9c, temp1,
    temp2, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00])
}
