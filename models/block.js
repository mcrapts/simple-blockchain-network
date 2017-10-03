class Block {
  constructor(index, prevHash, transactions, nonce) {
    this.index = index
    this.prevHash = prevHash
    this.transactions = transactions
    this.timestamp = Date.now()
    this.nonce = nonce
  }
}

module.exports = Block
