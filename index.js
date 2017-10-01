const express = require('express')
const app = express()
const util = require('util')
const Blockchain = require('./models/blockchain')
const args = require('minimist')(process.argv.slice(2))
const port = args.port || 3000

const blockchain = new Blockchain('000')
blockchain.addTransaction('henk', 'klaas', 5)
blockchain.addTransaction('piet', 'gerrit', 2)
blockchain.mineBlock()
blockchain.addTransaction('daan', 'terry', 3)
blockchain.addTransaction('marco', 'peter', 1)
blockchain.mineBlock()

app.use((req, res, next) => {
  req.node = req.protocol + '://' + req.get('host') + req.originalUrl
  next()
})

app.get('/', (req, res) => {
  const node = req.node
  res.send({ node })
})

app.get('/chain', (req, res) => {
  res.json(blockchain.chain)
})

app.listen(port, () => {
  console.log(`Node listening on port ${port}`)
})

// console.log(util.inspect(blockchain.chain, false, null))
