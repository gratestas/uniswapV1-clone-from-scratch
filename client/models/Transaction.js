import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
  txHash: String,
  txType: String,
  fromAddress: String,
  toAddress: String,
  amountSold: String,
  amountPurchased: String,
  timeStamp: Number,
})

global.Transaction =
  global.Transaction || mongoose.model('Transaction', TransactionSchema)
export default global.Transaction
