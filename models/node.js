module.exports = class Node {
  constructor(address) {
    this.address = address
    this.registeredAt = Date.now()
    // this.lastSync = 0
    // this.transactions = []
    // this.chain = []
  }
}
