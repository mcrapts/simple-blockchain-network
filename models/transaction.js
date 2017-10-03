module.exports = class Transaction {
  constructor(to, from, qty) {
    this.timestamp = Date.now()
    this.to = to
    this.from = from
    this.qty = qty
  }
}
