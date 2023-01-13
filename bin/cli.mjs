import { parseArgs } from 'node:util'
import { LitraController, TEMP_MAX, TEMP_MIN } from '../index.mjs'

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

const glow = new LitraController()

if (values.info || positionals.includes('info')) {
  const info = glow.getInfo()
  if (info) {
    console.table(info)
  } else {
    console.warn('Device is currently unavailable')
  }
  process.exit(0)
}

if (values.on || positionals.includes('on')) {
  if (glow.on()) {
    console.log(`Let there be light!`)
  } else {
    console.warn('Device is currently unavailable')
  }
}

if (values.off || positionals.includes('off')) {
  if (glow.off()) {
    console.log(`Nothing to see here.`)
  } else {
    console.warn('Device is currently unavailable')
  }
}

if (values.brightness) {
  const level = parseInt(values.brightness, 10)
  if (level >= 0 || level <= 100) {
    if (glow.setBrightness(level)) {
      console.log(`Brightness set to ${level}%`)
    } else {
      console.warn('Device is currently unavailable')
    }
  } else {
    console.error('Brightness level must be between 0 and 100')
    process.exit(1)
  }
}

if (values.temp) {
  const temp = parseInt(values.temp, 10)
  if (temp >= TEMP_MIN || temp <= TEMP_MAX) {
    if (glow.setTemperature(temp)) {
      console.log(`Temperature set to ${temp}K`)
    } else {
      console.warn('Device is currently unavailable')
    }
  } else {
    console.error(`Temperature setting must be between ${TEMP_MIN} and ${TEMP_MAX}`)
    process.exit(1)
  }
}

