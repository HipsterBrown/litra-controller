import { HID } from 'node-hid'

const VENDOR_ID = 0x046d
const PID_GLOW = 0xc900
const LIGHT_OFF = 0x00
const LIGHT_ON = 0x01
const BRIGHTNESS_MIN = 0x14
const BRIGHTNESS_MAX = 0xfa
export const TEMP_MAX = 6500
export const TEMP_MIN = 2700
const ENTRY_BYTES = [0, 0x11, 0xff, 0x04]
const POWER_BYTES = [0x1c]
const BRIGHTNESS_BYTES = [0x4c, 0x00]
const TEMP_BYTES = [0x9c]

export class LitraController {
  #device;

  constructor() {
    this.#device = new HID(VENDOR_ID, PID_GLOW)
  }

  getInfo() {
    return this.#device.getDeviceInfo()
  }

  on() {
    this.#device.write(ENTRY_BYTES.concat(POWER_BYTES, [LIGHT_ON], new Array(15).fill(0)))
  }

  off() {
    this.#device.write(ENTRY_BYTES.concat(POWER_BYTES, [LIGHT_OFF], new Array(15).fill(0)))
  }

  setBrightness(level) {
    const adjustedLevel = Math.floor(BRIGHTNESS_MIN + ((level / 100) * (BRIGHTNESS_MAX - BRIGHTNESS_MIN)))
    this.#device.write(ENTRY_BYTES.concat(BRIGHTNESS_BYTES, [adjustedLevel], new Array(14).fill(0)))
  }

  setTemperature(temp) {
    const adjustedTemp = temp.toString(16).padStart(4, '0').toUpperCase()

    const temp1 = parseInt(adjustedTemp.slice(0, 2), 16)
    const temp2 = parseInt(adjustedTemp.slice(2), 16)

    this.#device.write(ENTRY_BYTES.concat(TEMP_BYTES, [temp1, temp2], new Array(14).fill(0)))

  }
}
