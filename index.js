const crypto = require('crypto')
const util = require('util')
const hashString = input => crypto.createHash('sha256').update(input).digest('hex')

class Block {
  constructor(index, prevHash, transactions, nonce) {
    this.index = index
    this.prevHash = prevHash
    this.transactions = transactions
    this.timestamp = Date.now()
    this.nonce = nonce
  }
  get hash() {
    return hashString(JSON.stringify(this))
  }
}

class Blockchain {
  constructor(difficulty = '000') {
    this.difficulty = difficulty
    this.transactions = []
    this.chain = []
    this.mineBlock() // Genesis block
  }

  get lastBlock() {
    const index = this.chain.length - 1
    return index >= 0 ? this.chain[index] : null
  }

  addTransaction(from, to, qty) {
    this.transactions.push({ from, to, qty })
  }

  mineBlock() {
    let nonce = 0
    while (true) {
      const lastBlock = this.lastBlock
      let index, prevHash
      if (!lastBlock) {
        index = 0
        prevHash = 0
      } else {
        index = lastBlock.index + 1
        prevHash = lastBlock.hash
      }
      const transactions = JSON.parse(JSON.stringify(this.transactions))
      const block = new Block(index, prevHash, transactions, nonce)
      if (block.hash.startsWith(this.difficulty)) {
        this.chain.push(block)
        this.transactions = []
        return block
      } else {
        nonce += 1
      }
    }
  }
}

const blockchain = new Blockchain('00')
blockchain.addTransaction('henk', 'klaas', 5)
blockchain.addTransaction('piet', 'gerrit', 2)
blockchain.mineBlock()
blockchain.addTransaction('daan', 'terry', 3)
blockchain.addTransaction('marco', 'peter', 1)
blockchain.mineBlock()
console.log(util.inspect(blockchain.chain, false, null))
