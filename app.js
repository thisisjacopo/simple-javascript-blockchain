const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timeStamp, data, previousHash = "") {
    this.index = index;
    this.timeStamp = timeStamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timeStamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(Date.parse(0, "2017-01-01"), {}, "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log("the current hash does not match with its own property");
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log(
          "the current block prev hash does not match with the prev block hash"
        );
        return false;
      }
    }
    return true;
  }
}

let jacoCoin = new Blockchain();
jacoCoin.addBlock(new Block(1, "02/01/2022", { amount: 100 }));
jacoCoin.addBlock(new Block(2, "12/01/2022", { amount: 30 }));

console.log(JSON.stringify(jacoCoin, null, 4));
console.log("is chain valid", jacoCoin.isChainValid());

jacoCoin.chain[1].data = { amount: 2000 };

console.log("is chain valid", jacoCoin.isChainValid());
