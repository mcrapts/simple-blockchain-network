const crypto = require('crypto')
const hashString = input => crypto.createHash('sha256').update(input).digest('hex')

module.exports = { hashString }
