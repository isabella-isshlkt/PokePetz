const test = require('node:test')
const assert = require('node:assert/strict')
const { hashPassword, verifyPassword } = require('./passwords')

test('password hashes verify without storing the original password', async () => {
  const password = 'correct-horse-battery-staple'
  const hash = await hashPassword(password)

  assert.notEqual(hash, password)
  assert.match(hash, /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/)
  assert.deepEqual(await verifyPassword(password, hash), {
    matches: true,
    needsUpgrade: false
  })
  assert.deepEqual(await verifyPassword('wrong-password', hash), {
    matches: false,
    needsUpgrade: false
  })
})

test('legacy plaintext passwords can be upgraded after successful login', async () => {
  assert.deepEqual(await verifyPassword('legacy-password', 'legacy-password'), {
    matches: true,
    needsUpgrade: true
  })
  assert.deepEqual(await verifyPassword('wrong-password', 'legacy-password'), {
    matches: false,
    needsUpgrade: false
  })
})
