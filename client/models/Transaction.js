import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  _id: String,
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
  mongoose.model('Transaction', transactionSchema)
export default Transaction
