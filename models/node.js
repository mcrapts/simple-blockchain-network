module.exports = class Node {
  constructor(id) {
    this.id = id
    this.registeredAt = Date.now()
    this.lastSync = 0
    this.transactions = []
    this.chain = []
  }
}
