const { hashString } = require('../utils')
const { nanoid } = require('nanoid')

module.exports = class Transaction {
  constructor(to, from, qty) {
    this.id = nanoid(10)
    this.timestamp = Date.now()
    this.to = to
    this.from = from
    this.qty = qty
    this.hash = hashString(JSON.stringify(this))
  }
}
