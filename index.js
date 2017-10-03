const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const args = require('minimist')(process.argv.slice(2))
const port = args.port || 3000
const routes = require('./routes')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(bodyParser.json())
app.use((req, res, next) => {
  req.node = req.protocol + '://' + req.get('host')
  next()
})

app.use('/', routes)

app.listen(port, () => {
  console.log(`Node listening on port ${port}`)
})
