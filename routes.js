const express = require('express')
const router = express.Router()
const util = require('util')
const Blockchain = require('./models/blockchain')

const blockchain = new Blockchain('000')
blockchain.addTransaction('henk', 'klaas', 5)
blockchain.addTransaction('piet', 'gerrit', 2)
blockchain.mineBlock()
blockchain.addTransaction('daan', 'terry', 3)
blockchain.addTransaction('marco', 'peter', 1)
blockchain.mineBlock()
console.log(util.inspect(blockchain.chain, false, null))

router.get('/', (req, res) => {
  const node = req.node
  res.send({ node })
})

router.get('/chain', (req, res) => {
  const chain = blockchain.chain
  const hashes = blockchain.hashes
  res.json({ chain, hashes })
})

router.get('/transactions', (req, res) => {
  res.send(blockchain.transactions)
})

router.get('/nodes', (req, res) => {
  res.send(blockchain.nodes)
})

router.post('/transaction', (req, res) => {
  const { from, to, qty } = req.body
  console.log({ from, to, qty })
  blockchain.addTransaction(from, to, qty)
  res.sendStatus(200)
})

router.post('/resolve', (req, res) => {
  console.log('Resolving')
  blockchain.resolveChain()
  blockchain.resolveTransactions()
  res.sendStatus(200)
})

router.post('/register', async (req, res) => {
  const { address } = req.body
  try {
    const result = await blockchain.registerNode(req.node, address)
    res.send(result)
  } catch (error) {
    res.send({ error: error.message })
  }
})

router.post('/mine', (req, res) => {
  blockchain.mineBlock()
  res.sendStatus(200)
})

module.exports = router
