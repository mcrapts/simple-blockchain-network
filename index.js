const crypto = require('crypto')
const util = require('util')
const hashString = input => crypto.createHash('sha256').update(input).digest('hex')

class Block {
  constructor(index, transactions, prevHash, nonce) {
    this.index = index
    this.timestamp = Date.now()
    this.transactions = transactions
    this.prevHash = prevHash
    this.nonce = nonce
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

  hashBlock(block) {
    return block ? hashString(JSON.stringify(block)) : null
  }

  mineBlock() {
    let nonce = 0
    let nonceFound
    while (!nonceFound) {
      const index = this.chain.length
      const transactions = JSON.parse(JSON.stringify(this.transactions))
      const prevHash = this.hashBlock(this.lastBlock)
      const block = new Block(index, transactions, prevHash, nonce)
      const hash = this.hashBlock(block)
      if (hash.startsWith(this.difficulty)) {
        this.chain.push(block)
        this.transactions = []
        nonceFound = true
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
