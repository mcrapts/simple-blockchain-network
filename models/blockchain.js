const Block = require('./block')
const Node = require('./node')
const request = require('axios')
const { hashString } = require('../utils')

class Blockchain {
  constructor(difficulty = '000') {
    console.log('Creating blockchain with difficulty ' + difficulty)
    this.difficulty = difficulty
    this.transactions = []
    this.chain = []
    this.nodes = []
    this.mineBlock() // Genesis block
  }

  getLastBlock() {
    const index = this.chain.length - 1
    return index >= 0 ? this.chain[index] : null
  }

  getHash(block) {
    return hashString(JSON.stringify(block))
  }

  addTransaction(from, to, qty) {
    this.transactions.push({ from, to, qty })
    this.nodes.forEach(({ address }) => {
      request.post(address + '/transaction', { from, to, qty })
    })
  }

  mineBlock() {
    let nonce = 0
    while (true) {
      const lastBlock = this.getLastBlock()
      const index = lastBlock ? lastBlock.index + 1 : 0
      const prevHash = lastBlock ? this.getHash(lastBlock) : 0
      const transactions = JSON.parse(JSON.stringify(this.transactions))
      const block = new Block(index, prevHash, transactions, nonce)
      if (this.getHash(block).startsWith(this.difficulty)) {
        this.addBlockToChain(block)
        return block
      } else {
        nonce += 1
      }
    }
  }

  addBlockToChain(block) {
    this.chain.push(block)
    this.transactions = []
    this.nodes.forEach(({ address }) => {
      request.post(address + '/resolve')
    })
  }

  validateChain(chain) {
    const blocksValid = chain.map(block => {
      const prevBlock = chain[block.index - 1]
      if (prevBlock && (block.prevHash !== this.getHash(prevBlock))) {
        console.log('Chain is not valid')
        return false
      }
      return true
    })
    console.log(blocksValid)
    return !blocksValid.some(validBlock => validBlock === false)
  }

  async registerNode(address) {
    const node = this.nodes.find(node => node.address === address)
    if (!node) {
      try {
        await request(address)
        this.nodes.push(new Node(address))
        return this.nodes
      } catch (err) {
        throw new Error('Unable to reach node')
      }
    } else {
      throw new Error('Node already exists')
    }
  }

  resolveChain() {
    this.nodes.forEach(async ({ address }) => {
      const chain = await request.get(address + '/chain')
      if (this.validateChain(chain) && chain.length > this.chain.length) {
        this.chain = chain
        // what about transactions...?
      }
    })
  }
}
module.exports = Blockchain
