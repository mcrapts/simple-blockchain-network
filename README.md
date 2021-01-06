# simple-blockchain-network
This repository shows a simple blockchain network implementation. Each instance can be considered a blockchain node. You can use the API endpoints defined in `routes.js` to interact with the nodes.

## Launch a node
Launch a node by running `node index.js --port <PORT>` (defaults to port 3000)

## Example
1. Launch two nodes:

`node index.jes --port 3000`

`node index.jes --port 3001`

2. Register node: `curl -X POST http://localhost:3000/register --data '{"address":"http://localhost:3001"}'`

3. Verify node is registered by retrieving the `nodes` endpoint: `curl http://localhost:3000/nodes` and `curl http://localhost:3001/nodes` should both show the other node as registered.

4. Add a transaction: `curl -X POST http://localhost:3000/transaction --data '{"from":"hank","to":"walter","qty":7}'`

5. Add another transaction: `curl -X POST http://localhost:3000/transaction --data '{"from":"saul","to":"gus","qty":3}'`

6. Verify the transactions are added to the transaction pool on both nodes: `curl http://localhost:3001/transactions` and `curl http://localhost:3001/transactions` should both show the same unprocessed transactions.

7. Ask either one of the nodes to mine a new block: `curl -X POST http://localhost:3000/mine` or `curl -X POST http://localhost:3001/mine`

8. Verify the transaction is added to the chain: `curl http://localhost:3000/chain` and `curl http://localhost:3001/chain`
