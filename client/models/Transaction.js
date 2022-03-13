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

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model('Transaction', TransactionSchema)
export default Transaction
