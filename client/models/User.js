import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  _id: String,
  address: String,
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
})

const User = mongoose.model('User', userSchema)
export default User
