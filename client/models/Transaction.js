import mongoose from 'mongoose'

export const transactionSchema = new mongoose.Schema({
  txHash: String,
  fromAddress: String,
  toAddress: String,
  amountSold: Number,
  amountPurchased: Number,
  timeStamp: Date,
})

const Transaction = mongoose.model('Transaction', transactionSchema)
export default Transaction
