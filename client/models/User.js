import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  _id: String,
  address: String,
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      index: true,
    },
  ],
})

global.User = global.User || mongoose.model('User', UserSchema)
export default global.User
