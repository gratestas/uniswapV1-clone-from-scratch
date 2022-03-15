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

const User = mongoose.models.User || mongoose.model('User', UserSchema)
export default User
