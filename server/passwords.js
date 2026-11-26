const { promisify } = require('node:util')
const {
  randomBytes,
  scrypt: scryptCallback,
  timingSafeEqual
} = require('node:crypto')

const scrypt = promisify(scryptCallback)
const HASH_PREFIX = 'scrypt$'
const HASH_LENGTH = 64

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = await scrypt(password, salt, HASH_LENGTH)
  return `${HASH_PREFIX}${salt}$${hash.toString('hex')}`
}

async function verifyPassword(password, storedPassword) {
  if (!storedPassword.startsWith(HASH_PREFIX)) {
    return {
      matches: storedPassword === password,
      needsUpgrade: storedPassword === password
    }
  }

  const [, salt, storedHash] = storedPassword.split('$')
  if (!salt || !/^[a-f0-9]{128}$/i.test(storedHash || '')) {
    return { matches: false, needsUpgrade: false }
  }

  const actualHash = await scrypt(password, salt, HASH_LENGTH)
  const expectedHash = Buffer.from(storedHash, 'hex')

  return {
    matches: timingSafeEqual(actualHash, expectedHash),
    needsUpgrade: false
  }
}

module.exports = { hashPassword, verifyPassword }
