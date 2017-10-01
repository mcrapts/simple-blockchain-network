const Block = require('./block')
const Node = require('./node')

class Blockchain {
  constructor(difficulty = '000') {
    console.log('Creating blockchain with difficulty ' + difficulty)
    this.difficulty = difficulty
    this.transactions = []
    this.chain = []
    this.nodes = []
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

  validateChain(chain) {
    const blocksValid = chain.map(block => {
      const prevBlock = chain[block.index - 1]
      if (prevBlock && (block.prevHash !== prevBlock.hash)) {
        console.log('Chain is not valid')
        return false
      }
      return true
    })
    console.log(blocksValid)
    return !blocksValid.some(validBlock => validBlock === false)
  }

  registerNode(id) {
    const node = this.nodes.find(node => node.id === id)
    if (!node) this.nodes.push(new Node(id))
    return this.nodes
  }
}
module.exports = Blockchain
