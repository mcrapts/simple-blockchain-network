module.exports = class Node {
  constructor(address) {
    this.address = address
    this.registeredAt = Date.now()
  }
}
