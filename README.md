## Muuswap: a decentralized exchange running on Ethereum network.
### This is a simplified replication of [Uniswap](https://uniswap.org/)-V1 from scratch
For educational purpose, this project was built from the ground up powered by Ethereum smart contracts written in Solidity programming language. The UI was created by using Next.js framework.

## Used Technologies
* [Solidity](https://soliditylang.org/)
* [Ethers.js](https://docs.ethers.io/v5/) 
* [Hardhat](https://hardhat.org/) 
* [Next.js](https://nextjs.org/) 
* [Mongoose](https://mongoosejs.com/) 
* [Tailwindcss](https://tailwindcss.com/) 

## Requirements For Initial Setup
* [Node.js](https://nodejs.org/en/) `version: ^12.13.0`
* [Metamask](https://metamask.io/)

## Running This Project
### Local setup
To run this project locally, follow these steps.
#### 1. Clone the repository
```
$ git clone https://github.com/gratestas/uniswapV1-clone-from-scratch.git
```
#### 2. Change into the directory, and install the project's dependencies
```js
$ cd uniswapV1-clone-from-scratch

//install dependencies using Yarn
$ yarn install
```
#### 3. Start the [local Ethereum network node](https://hardhat.org/hardhat-network/)
```
npx hardhat node
```
#### 4. Deploy the smart contracts to the localhost network
Deploy the smart contracts, keeping the local node up and running in a separate terminal.
```js
// deploy tokens
$ npx hardhat run scripts/deploy_token.js --network localhost

// deploy exchange factory
$ npx hardhat run scripts/deploy.js --network localhost
```
#### 5. Run tests
```
$ npx hardhat test
```
#### 6. Connect accounts provided by the local node to Metamask
Copy private keys given in the terminal of running local node and import them to Metamask.
```solidity
$ npx hardhat node
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
//Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

//Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
...
```
Connect you metamask to hardhat network.

`Note:` If you have not added it before, please follow this post - [How to add Custom Network to Metamask](https://dev.to/afozbek/how-to-add-custom-network-to-metamask-l1n)

#### 7. Run the dapp
```
// change into the client directory 
$ cd client/

// install project's dependecies using Yarn
$ yarn install

// run the dapp
$ yarn dev
```
