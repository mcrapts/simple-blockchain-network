const Block = require('./block')
const Node = require('./node')
const Transaction = require('./transaction')
const request = require('axios')
const { hashString } = require('../utils')

class Blockchain {
  constructor(difficulty = '000') {
    console.log('Creating blockchain with difficulty ' + difficulty)
    this.difficulty = difficulty
    this.transactions = []
    this.chain = []
    this.nodes = []
    this.hashes = []
    this.mineBlock() // Genesis block
  }

  getLastBlock() {
    const index = this.chain.length - 1
    return index >= 0 ? this.chain[index] : null
  }

  getHash(obj) {
    return hashString(JSON.stringify(obj))
  }

  addTransaction(from, to, qty) {
    this.transactions.push(new Transaction(from, to, qty))
    this.nodes.forEach(({ address }) => {
      request.post(address + '/resolve')
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
    this.hashes[block.index] = this.getHash(block)
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
    return !blocksValid.some(validBlock => validBlock === false)
  }

  async registerNode(currentNode, address) {
    const node = this.nodes.find(node => node.address === address)
    if (!node) {
      try {
        this.nodes.push(new Node(address))
        await request.post(address + '/register', currentNode)
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
      const { data } = await request.get(address + '/chain')
      const chain = data.chain
      if (this.validateChain(chain) && chain.length > this.chain.length) {
        this.chain = chain
        this.resolveTransactions()
        this.nodes.forEach(node => request.post(node.address + '/resolve')
        )
      }
    })
  }

  findTransaction(hash) {
    const transactions = this.chain.reduce((arr, block) => {
      return arr.concat(block.transactions)
    }, [])
    const transaction = transactions.find(t => t.hash === hash)
    console.log('\nSearching for:')
    console.log(hash)
    console.log(transaction)

    return transaction
  }

  resolveTransactions() {
    this.nodes.forEach(async ({ address }) => {
      let { data: transactions } = await request.get(address + '/transactions')
      const transactionsNotInChain = transactions.filter(({ hash }) => {
        return !(this.findTransaction(hash))
      })
      if ((transactionsNotInChain.length > this.transactions.length) && (this.getHash(transactions) !== this.getHash(this.transactions))) {
        this.transactions = transactions
        console.log(this.transactions.length)
        this.nodes.forEach(node => request.post(node.address + '/resolve'))
      }
      this.transactions.forEach((transaction, index) => {
        if (this.findTransaction(transaction.hash)) {
          this.transactions.splice(index, 1)
        }
      })
    })
  }
}
module.exports = Blockchain
