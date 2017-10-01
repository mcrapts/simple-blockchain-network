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
  res.json(blockchain.chain)
})

router.get('/transactions', (req, res) => {
  res.send(blockchain.transactions)
})

router.post('/transaction', (req, res) => {
  const { from, to, qty } = req.body
  console.log({ from, to, qty })
  blockchain.addTransaction(from, to, qty)
  res.sendStatus(200)
})

router.post('/resolve', (req, res) => {
  blockchain.resolveChain()
  res.sendStatus(200)
})

router.post('/register', (req, res) => {
  const { address } = req.body
  blockchain.registerNode(address)
  res.send(blockchain.nodes)
})

module.exports = router
