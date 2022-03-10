import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  _id: String,
  txHash: String,
  fromAddress: String,
  toAddress: String,
  amountSold: String,
  amountPurchased: String,
  timeStamp: Date,
})

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model('Transaction', transactionSchema)
export default Transaction
